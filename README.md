# Venue-Connect

Venue Connect is a modular digital platform designed to connect people searching for event venues in Zimbabwe with venue owners, featuring AI venue recommendations, instant booking inquiries, and administrative oversight.

---

## 1. Project Architecture & Structure

The repository is organized into a modular Django REST Framework (DRF) backend and a React + Vite frontend:

```text
Venue-Connect/
│
├── backend/                        # Django REST Framework Backend
│   ├── manage.py                   # Django CLI entrypoint
│   ├── db.sqlite3                  # SQLite Database (seeded with demo data)
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Backend environment variable template
│   ├── venueconnect/               # Project configuration app
│   │   ├── settings.py             # Settings (CORS, JWT, DRF, Middleware)
│   │   ├── urls.py                 # Versioned router (/api/v1/ and /api/)
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── venues/                     # Venues app
│   │   ├── models.py               # Venue, VenuePhoto, VenueAvailability, Amenity, EventType
│   │   ├── serializers.py          # Serializers with camelCase & snake_case support
│   │   ├── views.py                # VenueViewSet, recommend action, photo uploads
│   │   ├── filters.py              # VenueFilter (location, price, capacity, status)
│   │   ├── urls.py                 # Venues, Amenities, Event Types routers
│   │   ├── admin.py
│   │   ├── tests.py                # Automated DRF tests
│   │   └── management/commands/    # seed_demo_data command
│   ├── bookings/                   # Reservations & booking management
│   │   ├── models.py               # Booking model with customer details & status
│   │   ├── serializers.py          # Serializer with date/time formatting
│   │   ├── views.py                # BookingViewSet with cancel, confirm, decline actions
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── tests.py
│   ├── users/                      # Authentication & user profiles
│   │   ├── models.py               # UserProfile model (role: customer, owner, admin)
│   │   ├── serializers.py          # RegisterSerializer, LoginSerializer, UserSerializer
│   │   ├── views.py                # RegisterView, LoginView, MeView, UserViewSet
│   │   ├── urls.py                 # Auth & user management routes
│   │   ├── admin.py
│   │   └── tests.py
│   ├── reviews/                    # Venue reviews & ratings
│   │   ├── models.py               # Review model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   └── notifications/              # System notifications
│
├── frontend/                       # React 18 + Vite Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── .env                        # Frontend environment variables
│   ├── .env.example
│   ├── src/
│   │   ├── App.jsx                 # Main state coordinator & view router
│   │   ├── main.jsx
│   │   ├── services/
│   │   │   └── api.js              # Centralized DRF API service layer
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Role switcher & navigation
│   │   │   ├── Footer.jsx
│   │   │   ├── VenueCard.jsx
│   │   │   ├── BookingModal.jsx    # Instant reservation form connected to DRF
│   │   │   ├── AiVenueFinder.jsx   # AI Matcher connected to /venues/recommend/
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Hero, featured venues, categories
│   │   │   ├── Venues.jsx          # Search and filter listings
│   │   │   ├── VenueDetails.jsx    # Venue specs, photos, booking modal
│   │   │   ├── Login.jsx           # JWT login connected to /api/v1/auth/login/
│   │   │   ├── Register.jsx        # Registration connected to /api/v1/auth/register/
│   │   │   ├── CustomerDashboard.jsx # Reservations list & cancellation
│   │   │   ├── OwnerDashboard.jsx  # New venue listing & booking moderation
│   │   │   └── AdminDashboard.jsx  # Venue moderation & user account status
│   │   ├── styles/                 # Theme styles
│   │   └── data/mockData.js        # Fallback datasets
│
└── .venv/                          # Python virtual environment (ignored in git)
```

---

## 2. Django Apps & Responsibilities

1. **`venues`**:
   - Manages persistent venue listings across Zimbabwean cities (Bulawayo, Harare, Gweru, Mutare, Masvingo, Victoria Falls, Kwekwe).
   - Manages amenities, event categories, cover/gallery photos, and dates.
   - Houses the AI recommendation engine endpoint (`/api/v1/venues/recommend/`) matching guest capacity, budget, city, and infrastructure (Solar, Generator, Borehole).
2. **`bookings`**:
   - Stores reservation inquiries and bookings with date, time, guest count, and pricing.
   - Provides status management actions (`confirm`, `decline`, `cancel`).
3. **`users`**:
   - Manages user accounts and `UserProfile` associations (`role`: `customer`, `owner`, `admin`).
   - Issues JWT access/refresh tokens for authenticated sessions (`/api/v1/auth/login/`, `/api/v1/auth/register/`).
   - Provides user administration for platform admins (`toggle_status`).
4. **`reviews`**:
   - Manages customer ratings (1-5 stars) and feedback comments tied to venues and bookings.

---

## 3. How to Run Locally

### Step 1: Clone and Set Up the Python Virtual Environment

In the project root directory:

```bash
# 1. Create a virtual environment
python -m venv .venv

# 2. Activate the virtual environment
# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# On Windows (Command Prompt):
.\.venv\Scripts\activate.bat
# On Linux / macOS:
source .venv/bin/activate

# 3. Install backend dependencies
pip install -r backend/requirements.txt
```

### Step 2: Configure Environment Variables

1. **Backend** (`backend/.env`):
   ```bash
   cp backend/.env.example backend/.env
   ```
   Contains default `SECRET_KEY`, `DEBUG=True`, `ALLOWED_HOSTS`, and `CORS_ALLOWED_ORIGINS`.

2. **Frontend** (`frontend/.env`):
   ```bash
   # Already created:
   VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
   ```

### Step 3: Run Database Migrations & Seed Demo Data

The project already uses SQLite (`backend/db.sqlite3`). To ensure all migrations and demo records are in place:

```bash
# Run migrations safely
python backend/manage.py migrate

# Seed realistic Zimbabwean venues and demo accounts
python backend/manage.py seed_demo_data
```

### Step 4: Run Backend Unit Tests

Verify that all DRF endpoints and logic pass:

```bash
python backend/manage.py test venues bookings users
```

### Step 5: Start the Django Development Server

Run the server on `http://127.0.0.1:8000`:

```bash
python backend/manage.py runserver 127.0.0.1:8000
```

### Step 6: Start the Frontend Application

Open a second terminal, navigate to `frontend/`, install node packages and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:
**`http://localhost:5173`** (or `http://127.0.0.1:5173`).

---

## 4. API Endpoints Documentation

Base URL: **`http://127.0.0.1:8000/api/v1/`** (also mirrored at `/api/`)

### Venues (`/api/v1/venues/`)
- `GET /api/v1/venues/`: List venues (supports filters: `?location=`, `?category=`, `?min_price=`, `?max_price=`, `?search=`).
- `POST /api/v1/venues/`: Create a new venue listing (accepts both `title` and `name`, `pricePerDay`, `amenity_names`, `new_images`).
- `GET /api/v1/venues/{id}/`: Retrieve venue details.
- `PATCH /api/v1/venues/{id}/`: Update venue.
- `DELETE /api/v1/venues/{id}/`: Delete venue listing.
- `POST /api/v1/venues/{id}/approve/`: Approve pending venue listing (admin).
- `POST /api/v1/venues/{id}/suspend/`: Suspend venue listing (admin).
- `POST /api/v1/venues/recommend/`: AI recommendation matching endpoint.
- `GET /api/v1/amenities/`: List available venue amenities.
- `GET /api/v1/event-types/`: List available event types.

### Bookings (`/api/v1/bookings/`)
- `GET /api/v1/bookings/`: List reservations.
- `POST /api/v1/bookings/`: Submit a reservation inquiry (supports `venueId`, `eventDate`, `startTime`, `endTime`, `guestCount`, `grandTotal`).
- `GET /api/v1/bookings/{id}/`: Retrieve booking details.
- `POST /api/v1/bookings/{id}/confirm/`: Mark booking as Confirmed (owner).
- `POST /api/v1/bookings/{id}/decline/`: Mark booking as Declined (owner).
- `POST /api/v1/bookings/{id}/cancel/`: Mark booking as Cancelled (customer).

### Authentication & Users (`/api/v1/auth/` & `/api/v1/users/`)
- `POST /api/v1/auth/register/`: Register a new user (`name`, `email`, `phone`, `password`, `role`). Returns JWT tokens.
- `POST /api/v1/auth/login/`: Authenticate user (`email`, `password`). Returns JWT tokens and user profile.
- `GET /api/v1/auth/me/`: Retrieve current authenticated user profile.
- `POST /api/v1/auth/token/refresh/`: Refresh JWT access token.
- `GET /api/v1/users/`: List all users (admin dashboard).
- `POST /api/v1/users/{id}/toggle_status/`: Toggle user status between Active and Suspended (admin).

---

## 5. Pre-Configured Demo Accounts

All demo accounts have password: **`password123`**

| Role | Username | Email | Permissions |
| :--- | :--- | :--- | :--- |
| **Customer** | `tendai` | `tendai@connect.co.zw` | Browse venues, instant booking, view reservations |
| **Customer** | `chipo` | `chipo@connect.co.zw` | Browse venues, instant booking, view reservations |
| **Venue Owner** | `farai` | `farai@venueowner.co.zw` | List new venues, approve/decline booking requests |
| **Administrator** | `blessing` | `admin@venueconnect.co.zw` | Moderation: verify venues, suspend venues, manage users |
# Venue-Connect
