from sqlalchemy.orm import Session


import uuid
import qrcode
from pathlib import Path

QR_FOLDER = Path("uploads/qr_codes")
QR_FOLDER.mkdir(parents=True, exist_ok=True)

from backend.communication.email_service import EmailService
from backend.communication.email_templates import (
    registration_confirmation,
)

from backend.crud.event import get_event_by_id
from backend.crud.registration import (
    cancel_registration,
    count_event_registrations,
    create_registration,
    get_registration,
    get_registration_by_id,
    get_registrations_by_user,
)
from backend.crud.user import (
    get_user_by_id,
    get_user_by_email,
)
from backend.models.user import User
from backend.models.check_in import CheckIn
from datetime import date
from backend.crud.ticket import get_active_ticket_by_event
from backend.models.registration import Registration
from backend.schemas.registration import (
    RegistrationCreate,
    AdminAttendeeCreate,
)


def register_for_event(
    db: Session,
    registration: RegistrationCreate,
) -> Registration:
    """
    Register a user for an event and assign an active ticket.
    """

    # ==========================================
    # VALIDATE USER
    # ==========================================

    user = get_user_by_id(
        db,
        registration.user_id,
    )

    if user is None:
        raise ValueError(
            "User not found."
        )


    # ==========================================
    # VALIDATE EVENT
    # ==========================================

    event = get_event_by_id(
        db,
        registration.event_id,
    )

    if event is None:
        raise ValueError(
            "Event not found."
        )


    # ==========================================
    # PREVENT DUPLICATE REGISTRATION
    # ==========================================

    existing_registration = get_registration(
        db=db,
        user_id=registration.user_id,
        event_id=registration.event_id,
    )

    if existing_registration:

        # Allow registration again if old
        # registration was cancelled.
        if existing_registration.status != "Cancelled":

            raise ValueError(
                "User already registered for this event."
            )

        # Because database has a unique
        # user_id + event_id constraint,
        # cancelled registration cannot be
        # inserted as another row.
        #
        # Reusing it would require a separate
        # reactivation implementation.
        raise ValueError(
            "A cancelled registration already exists for this event."
        )


    # ==========================================
    # EVENT CAPACITY CHECK
    # ==========================================

    current_registrations = count_event_registrations(
        db=db,
        event_id=registration.event_id,
    )

    if current_registrations >= event.capacity:

        raise ValueError(
            "Event is full."
        )


    # ==========================================
    # FIND ACTIVE EVENT TICKET
    # ==========================================

    ticket = get_active_ticket_by_event(
        db=db,
        event_id=registration.event_id,
    )

    if ticket is None:

        raise ValueError(
            "No active ticket is available for this event."
        )


    # ==========================================
    # TICKET QUANTITY CHECK
    # ==========================================

    if ticket.quantity <= 0:

        raise ValueError(
            "Tickets are sold out."
        )


    # ==========================================
    # TICKET SALE DATE CHECK
    # ==========================================

    today = date.today()

    if today < ticket.sale_start_date:

        raise ValueError(
            "Ticket sale has not started yet."
        )

    if today > ticket.sale_end_date:

        raise ValueError(
            "Ticket sale has ended."
        )


    # ==========================================
    # CREATE REGISTRATION
    # ==========================================

    new_registration = create_registration(
        db=db,
        registration=registration,
        ticket_id=ticket.id,
    )


    # ==========================================
    # REGISTRATION NUMBER
    # ==========================================

    new_registration.registration_number = (
        "EVT-" +
        str(new_registration.id).zfill(6)
    )


    # ==========================================
    # GENERATE QR CODE
    # ==========================================

    qr_data = (
        f"Registration:"
        f"{new_registration.registration_number}"
    )

    qr_filename = (
        f"{new_registration.registration_number}.png"
    )

    qr_path = QR_FOLDER / qr_filename

    img = qrcode.make(
        qr_data
    )

    img.save(
        qr_path
    )

    new_registration.qr_code = (
        qr_filename
    )


    # ==========================================
    # REDUCE AVAILABLE TICKET QUANTITY
    # ==========================================

    ticket.quantity -= 1


    # ==========================================
    # SAVE
    # ==========================================

    db.commit()

    db.refresh(
        new_registration
    )


    # ==========================================
    # SEND CONFIRMATION EMAIL
    # ==========================================

    try:

        subject, body = registration_confirmation(

            user_name=(
                f"{user.first_name} "
                f"{user.last_name}"
            ),

            event_name=event.event_name,
        )

        EmailService.send_email(

            recipient=user.email,

            subject=subject,

            body=body,
        )

    except Exception as email_error:

        print("=" * 60)

        print(
            "EMAIL DELIVERY FAILED"
        )

        print(
            email_error
        )

        print("=" * 60)


    return new_registration

def register_attendee_by_admin(
    db: Session,
    attendee: AdminAttendeeCreate,
    admin_user_id: int,
):
    """
    Register an attendee from the admin/organizer
    attendee management dashboard.

    If a user with the supplied email already exists,
    that user is reused.

    Otherwise a basic attendee user is created.

    The normal registration service is then used so
    event capacity, ticket availability, registration
    number, QR generation and email confirmation all
    continue to work normally.
    """

    # ==========================================
    # VALIDATE INPUT
    # ==========================================

    name = attendee.name.strip()

    email = attendee.email.strip().lower()

    phone = (
        attendee.phone.strip()
        if attendee.phone
        else None
    )


    if not name:

        raise ValueError(
            "Attendee name is required."
        )


    if not email:

        raise ValueError(
            "Attendee email is required."
        )


    # ==========================================
    # FIND EXISTING USER
    # ==========================================

    user = get_user_by_email(
        db=db,
        email=email,
    )


    # ==========================================
    # CREATE USER WHEN NOT FOUND
    # ==========================================

    if user is None:

        name_parts = name.split(
            maxsplit=1
        )


        first_name = name_parts[0]


        last_name = (
            name_parts[1]
            if len(name_parts) > 1
            else ""
        )


        # role_id = 3 assumes role 3 is
        # your normal attendee/user role.
        #
        # Change this only if your database
        # uses a different ID for normal users.

        user = User(

            first_name=first_name,

            last_name=last_name,

            email=email,

            # Admin-created attendee does not
            # currently log in using this account.
            #
            # A placeholder value is stored because
            # password_hash is NOT NULL.
            password_hash=(
                "ADMIN_CREATED_ATTENDEE"
            ),

            phone=phone,

            role_id=3,

            is_active=True,
        )


        db.add(user)

        db.commit()

        db.refresh(user)


    else:

        # ======================================
        # OPTIONAL PHONE UPDATE
        # ======================================

        if phone and not user.phone:

            user.phone = phone

            db.commit()

            db.refresh(user)


    # ==========================================
    # CREATE NORMAL REGISTRATION
    # ==========================================

    registration_data = RegistrationCreate(

        user_id=user.id,

        event_id=attendee.event_id,
    )


    registration = register_for_event(

        db=db,

        registration=registration_data,
    )


    # ==========================================
    # OPTIONAL IMMEDIATE CHECK-IN
    # ==========================================

    normalized_status = (
        attendee.attendance_status
        .strip()
        .lower()
        .replace("_", "-")
        .replace(" ", "-")
    )


    if normalized_status == "checked-in":

        existing_check_in = (
            db.query(CheckIn)
            .filter(
                CheckIn.registration_id
                ==
                registration.id
            )
            .first()
        )


        if existing_check_in is None:

            check_in = CheckIn(

                registration_id=
                    registration.id,

                checked_in_by=
                    admin_user_id,

                entry_gate=
                    "Main Gate",

                badge_printed=
                    False,

                attendance_status=
                    "Checked-In",
            )


            db.add(check_in)

            db.commit()

            db.refresh(check_in)


    return registration

def get_my_registrations(
    db: Session,
    user_id: int,
) -> list[Registration]:
    """
    Get all registrations of the current user.
    """

    return get_registrations_by_user(
        db=db,
        user_id=user_id,
    )


def cancel_my_registration(
    db: Session,
    registration_id: int,
    user_id: int,
) -> Registration:
    """
    Cancel a user's registration.
    """

    registration = get_registration_by_id(
        db,
        registration_id,
    )

    if registration is None:
        raise ValueError(
            "Registration not found."
        )

    if registration.user_id != user_id:
        raise ValueError(
            "You can cancel only your own registration."
        )

    if registration.status == "Cancelled":
        raise ValueError(
            "Registration is already cancelled."
        )

    return cancel_registration(
        db=db,
        registration=registration,
    )

def get_all_attendee_details(
    db: Session,
):
    """
    Return detailed attendee information
    using registrations, users, events
    and check-ins.
    """

    registrations = (
        db.query(Registration)
        .order_by(
            Registration.id.desc()
        )
        .all()
    )

    attendees = []

    for registration in registrations:

        user = registration.user
        event = registration.event
        check_in = registration.check_in

        # Safety check for broken relationships
        if user is None or event is None:
            continue

        attendee = {

            "registration_id":
                registration.id,

            "registration_number":
                registration.registration_number,

            "user_id":
                registration.user_id,

            "event_id":
                registration.event_id,

            "name":
                f"{user.first_name} {user.last_name}".strip(),

            "email":
                user.email,

            "phone":
                user.phone,

            "event_name":
                event.event_name,

            "registration_date":
                registration.registration_date,

            "registration_status":
                registration.status,

            "attendance_status":
                (
                    check_in.attendance_status
                    if check_in
                    else "Pending"
                ),

            "check_in_time":
                (
                    check_in.check_in_time
                    if check_in
                    else None
                ),

        }

        attendees.append(
            attendee
        )

    return attendees