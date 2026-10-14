from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import UserProfile
from venues.models import Venue, VenuePhoto, Amenity, EventType
from bookings.models import Booking

User = get_user_model()

DEMO_USERS = [
    {'username': 'tendai', 'email': 'tendai@connect.co.zw', 'name': 'Tendai Moyo', 'phone': '+263 77 123 4567', 'role': 'customer'},
    {'username': 'farai', 'email': 'farai@venueowner.co.zw', 'name': 'Farai Mugabe', 'phone': '+263 77 987 6543', 'role': 'owner'},
    {'username': 'chipo', 'email': 'chipo@connect.co.zw', 'name': 'Chipo Ndlovu', 'phone': '+263 71 234 5678', 'role': 'customer'},
    {'username': 'blessing', 'email': 'admin@venueconnect.co.zw', 'name': 'Blessing Dube', 'phone': '+263 78 345 6789', 'role': 'admin'},
]

DEMO_VENUES = [
    {
        'name': 'Mhlahlandlela Gardens & Event Pavilion',
        'category': 'gardens',
        'tagline': 'Lush manicured garden pavilion with reliable solar & generator backup in Bulawayo.',
        'description': 'Mhlahlandlela Gardens offers a peaceful outdoor and covered venue nestled in Hillside, Bulawayo. Featuring manicured lawns, romantic gazebo arches, solar backup power, and dedicated borehole water supply, it is ideal for wedding receptions, graduations, and family reunions.',
        'location': 'Bulawayo',
        'suburb': 'Hillside',
        'address': '42 Hillside Road, Bulawayo, Zimbabwe',
        'capacity': 300,
        'price_per_hour': 45,
        'price': 350,
        'rating': 4.9,
        'review_count': 48,
        'status': 'approved',
        'featured': True,
        'images': [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
        ],
        'amenities': ['Solar Power Backup', 'Borehole Water Supply', 'Generator Backup', 'Ample Parking', 'Outdoor Garden', 'Tables & Chairs', 'Security Staff', 'Toilets & Restrooms'],
        'rules': ['Music must adhere to local municipal guidelines by 11:30 PM', 'No fireworks permitted', 'Catering setup allowed 2 hours prior']
    },
    {
        'name': 'Harare Grand Event Pavilion',
        'category': 'weddings',
        'tagline': 'Opulent banquet hall and event centre in Borrowdale with full generator power.',
        'description': 'Located in the prestigious Borrowdale area of Harare, the Harare Grand Event Pavilion is Zimbabwe’s premier destination for high-end wedding receptions, corporate galas, and national product launches. Equipped with uninterrupted generator power, sound systems, and VIP lounge amenities.',
        'location': 'Harare',
        'suburb': 'Borrowdale',
        'address': '15 Borrowdale Road, Harare, Zimbabwe',
        'capacity': 600,
        'price_per_hour': 80,
        'price': 600,
        'rating': 4.95,
        'review_count': 62,
        'status': 'approved',
        'featured': True,
        'images': [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80'
        ],
        'amenities': ['Generator Backup', 'Borehole Water Supply', 'Ample Parking', 'Professional Catering', 'Surround Sound System', 'Air Conditioning', 'High-Speed Wi-Fi', 'Security Staff'],
        'rules': ['Decorators must use free-standing supports', 'Licensed catering partners required']
    },
    {
        'name': 'Gweru Garden Event Centre',
        'category': 'gardens',
        'tagline': 'Affordable, serene garden space in Gweru for family & church events.',
        'description': 'Situated close to Gweru CBD, the Gweru Garden Event Centre provides an accessible, budget-friendly venue for church conferences, birthday parties, baby showers, and memorial gatherings. Outfitted with heavy-duty solar backup and clean borehole water.',
        'location': 'Gweru',
        'suburb': 'Gweru CBD',
        'address': '88 Main Street, Gweru, Zimbabwe',
        'capacity': 200,
        'price_per_hour': 35,
        'price': 250,
        'rating': 4.8,
        'review_count': 34,
        'status': 'approved',
        'featured': True,
        'images': [
            'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80'
        ],
        'amenities': ['Solar Power Backup', 'Borehole Water Supply', 'Tables & Chairs', 'Ample Parking', 'Outdoor Garden', 'Toilets & Restrooms'],
        'rules': ['Self-catering permitted with kitchen cleanup', 'Amplified sound allowed until 10:00 PM']
    },
    {
        'name': 'Victoria Falls Horizon Lodge & Terrace',
        'category': 'lodges',
        'tagline': 'Breathtaking terrace views near the Zambezi with executive conference rooms.',
        'description': 'Perched in Victoria Falls, this world-class lodge venue offers open-air sunset terraces and air-conditioned conference rooms. Perfect for international corporate retreats, executive summits, and unforgettable destination weddings.',
        'location': 'Victoria Falls',
        'suburb': 'Zambezi Drive',
        'address': '100 Zambezi Drive, Victoria Falls, Zimbabwe',
        'capacity': 180,
        'price_per_hour': 60,
        'price': 450,
        'rating': 4.92,
        'review_count': 55,
        'status': 'approved',
        'featured': True,
        'images': [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1545232979-fbfd42e000b5?auto=format&fit=crop&w=800&q=80'
        ],
        'amenities': ['Generator Backup', 'Solar Power Backup', 'High-Speed Wi-Fi', 'Professional Catering', 'Air Conditioning', 'HD Projector & Screen', 'Security Staff'],
        'rules': ['Wildlife guidelines apply near park boundary', 'In-house catering and beverage service']
    },
    {
        'name': 'Mutare Mountain View Pavilion',
        'category': 'weddings',
        'tagline': 'Scenic Eastern Highlands backdrop with spacious function hall.',
        'description': 'Surrounded by the picturesque hills of Murambi, Mutare Mountain View Pavilion combines natural mountain scenery with modern function space. Features solar backup, borehole water supply, and ample parking for large wedding receptions.',
        'location': 'Mutare',
        'suburb': 'Murambi',
        'address': '12 Murambi Drive, Mutare, Zimbabwe',
        'capacity': 350,
        'price_per_hour': 50,
        'price': 400,
        'rating': 4.85,
        'review_count': 41,
        'status': 'approved',
        'featured': False,
        'images': [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
        ],
        'amenities': ['Solar Power Backup', 'Borehole Water Supply', 'Outdoor Garden', 'Ample Parking', 'Tables & Chairs', 'Changing Rooms'],
        'rules': ['Outside caterers allowed with prior clearance', 'Event pack-up completed by midnight']
    },
    {
        'name': 'Masvingo Great Zimbabwe Conference Hall',
        'category': 'conferences',
        'tagline': 'High-capacity conference venue equipped with HD screens and generator backup.',
        'description': 'Located in Masvingo, this venue is ideal for provincial summits, corporate training, non-profit workshops, and school prize-giving ceremonies. Offers air conditioning, high-output generator backup, and full audiovisual support.',
        'location': 'Masvingo',
        'suburb': 'Masvingo CBD',
        'address': '45 Robert Mugabe Way, Masvingo, Zimbabwe',
        'capacity': 400,
        'price_per_hour': 40,
        'price': 320,
        'rating': 4.75,
        'review_count': 29,
        'status': 'approved',
        'featured': False,
        'images': [
            'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80'
        ],
        'amenities': ['Generator Backup', 'HD Projector & Screen', 'Surround Sound System', 'Air Conditioning', 'High-Speed Wi-Fi', 'Security Staff'],
        'rules': ['Technical setup test recommended 1 hour prior', 'No smoking within auditorium']
    },
    {
        'name': 'Kwekwe Central Community Event Hub',
        'category': 'halls',
        'tagline': 'Versatile community venue for church events, graduations, and celebrations.',
        'description': 'A spacious, central community hall in Kwekwe featuring heavy-duty solar power, tables and chairs for 250 guests, and secure parking. A popular choice for graduations, birthday parties, and church gatherings.',
        'location': 'Kwekwe',
        'suburb': 'Kwekwe CBD',
        'address': '10 Industrial Road, Kwekwe, Zimbabwe',
        'capacity': 250,
        'price_per_hour': 30,
        'price': 220,
        'rating': 4.7,
        'review_count': 22,
        'status': 'approved',
        'featured': False,
        'images': [
            'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80'
        ],
        'amenities': ['Solar Power Backup', 'Tables & Chairs', 'Ample Parking', 'Toilets & Restrooms', 'Full Service Kitchen'],
        'rules': ['Community hall code of conduct applies', 'Hall must be swept clean after use']
    },
    {
        'name': 'Avondale Executive Conference Suites',
        'category': 'conferences',
        'tagline': 'Modern, air-conditioned meeting suite in Avondale, Harare.',
        'description': 'Tailored for corporate board meetings, strategy workshops, and high-level training in Avondale, Harare. Features high-speed Wi-Fi, generator back-up, smart screen displays, and gourmet coffee break facilities.',
        'location': 'Harare',
        'suburb': 'Avondale',
        'address': '34 King George Road, Avondale, Harare, Zimbabwe',
        'capacity': 120,
        'price_per_hour': 45,
        'price': 280,
        'rating': 4.88,
        'review_count': 39,
        'status': 'approved',
        'featured': False,
        'images': [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80'
        ],
        'amenities': ['Generator Backup', 'High-Speed Wi-Fi', 'HD Projector & Screen', 'Air Conditioning', 'Ample Parking', 'Security Staff'],
        'rules': ['Quiet hours in shared building areas', 'Catering order confirmation required 24h prior']
    }
]


class Command(BaseCommand):
    help = 'Seeds database with realistic Zimbabwean venues and demo accounts'

    def handle(self, *args, **options):
        self.stdout.write("Seeding demo users...")
        created_users = {}
        for u in DEMO_USERS:
            user, created = User.objects.get_or_create(
                username=u['username'],
                defaults={'email': u['email'], 'first_name': u['name'].split()[0], 'last_name': u['name'].split()[1] if len(u['name'].split()) > 1 else ''}
            )
            if created:
                user.set_password('password123')
                if u['role'] == 'admin':
                    user.is_staff = True
                    user.is_superuser = True
                user.save()
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.role = u['role']
            profile.phone_number = u['phone']
            profile.save()
            created_users[u['role']] = user

        owner_user = created_users.get('owner') or User.objects.first()

        self.stdout.write("Seeding demo venues...")
        created_venues = []
        for v_data in DEMO_VENUES:
            venue, created = Venue.objects.get_or_create(
                name=v_data['name'],
                defaults={
                    'owner': owner_user,
                    'category': v_data['category'],
                    'tagline': v_data['tagline'],
                    'description': v_data['description'],
                    'location': v_data['location'],
                    'suburb': v_data['suburb'],
                    'address': v_data['address'],
                    'capacity': v_data['capacity'],
                    'price_per_hour': v_data['price_per_hour'],
                    'price': v_data['price'],
                    'rating': v_data['rating'],
                    'review_count': v_data['review_count'],
                    'status': v_data['status'],
                    'featured': v_data['featured'],
                    'rules': v_data['rules'],
                }
            )
            created_venues.append(venue)

            # Amenities
            for am_name in v_data['amenities']:
                amenity, _ = Amenity.objects.get_or_create(name=am_name)
                venue.amenities.add(amenity)

            # Photos
            if venue.photos.count() == 0:
                for idx, img_url in enumerate(v_data['images']):
                    VenuePhoto.objects.create(
                        venue=venue,
                        url=img_url,
                        is_cover=(idx == 0)
                    )

        self.stdout.write("Seeding sample bookings...")
        if created_venues and Booking.objects.count() == 0:
            client_user = created_users.get('customer') or User.objects.first()
            Booking.objects.create(
                client=client_user,
                venue=created_venues[0],
                customer_name='Tendai Moyo',
                customer_email='tendai.moyo@connect.co.zw',
                customer_phone='+263 77 123 4567',
                event_date='2026-10-15',
                start_time='10:00',
                end_time='18:00',
                guest_count=220,
                event_type='Wedding Reception',
                total_price=350.00,
                status='Confirmed',
                notes='Solar and generator backup confirmed for evening reception.'
            )
            if len(created_venues) > 1:
                Booking.objects.create(
                    client=client_user,
                    venue=created_venues[1],
                    customer_name='Tendai Moyo',
                    customer_email='tendai.moyo@connect.co.zw',
                    customer_phone='+263 77 123 4567',
                    event_date='2026-11-04',
                    start_time='09:00',
                    end_time='17:00',
                    guest_count=150,
                    event_type='Corporate Summit',
                    total_price=600.00,
                    status='Pending',
                    notes='Audiovisual technicians requested.'
                )
            if len(created_venues) > 2:
                Booking.objects.create(
                    client=created_users.get('customer') or client_user,
                    venue=created_venues[2],
                    customer_name='Chipo Ndlovu',
                    customer_email='chipo.ndlovu@connect.co.zw',
                    customer_phone='+263 71 234 5678',
                    event_date='2026-09-20',
                    start_time='11:00',
                    end_time='16:00',
                    guest_count=120,
                    event_type='Graduation Party',
                    total_price=250.00,
                    status='Confirmed',
                    notes='Tables and chairs arranged on lawn.'
                )

        # Seed sample notifications
        from notifications.models import Notification
        if Notification.objects.count() == 0:
            owner_u = created_users.get('owner') or User.objects.first()
            customer_u = created_users.get('customer') or User.objects.first()
            Notification.objects.create(
                user=owner_u,
                type='booking_request',
                message='New booking request for Harare Grand Event Pavilion on 2026-11-04.'
            )
            Notification.objects.create(
                user=customer_u,
                type='booking_confirmed',
                message='Your reservation for Mhlahlandlela Gardens on 2026-10-15 has been confirmed.'
            )

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded database! Total venues: {Venue.objects.count()}, Users: {User.objects.count()}, Bookings: {Booking.objects.count()}, Notifications: {Notification.objects.count()}"))
