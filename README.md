# 🛡️ ResQNet – Disaster Management & Emergency Response System

> **"Report. Respond. Rescue."**  
> A Next-Generation, Frontend-Driven Disaster Management & Emergency Operations System built for Authorities, First Responders, Relief Agencies, and Citizens.

---

## 📌 Project Overview

**ResQNet** is a modern, responsive web application designed to coordinate disaster preparation, response, and recovery. In high-stakes emergency situations like floods, cyclones, industrial fires, and landslides, timely communication and accurate logistics save lives. 

ResQNet centralizes multi-hazard reporting, interactive GIS hazard mapping, stockpile resource logistics, skill-based volunteer mobilization, relief center capacity tracking, and emergency alert broadcasting into an intuitive and visually striking command dashboard.

This project was developed as a comprehensive **Frontend Development Framework** project (React.js, Vite, Tailwind CSS, Leaflet GIS, Recharts, LocalStorage) without requiring external backend servers, making it easy to run, demonstrate, and explain during project presentations and viva examinations.

---

## ✨ Key Capabilities & Features

### 1. 🚨 Incident Reporting & Triage (`/report` & `/incidents`)
- **Rapid Public SOS Intake:** Fast emergency incident submission form with automatic ID generation (`INC-2026-001`).
- **Geo-Tagging & Presets:** Quick coordinate presets for major disaster-prone districts (Visakhapatnam, Gajuwaka, Kakinada, Vijayawada, Rajahmundry, Srikakulam, Nellore) + custom GPS coordinates.
- **Categorization & Severity:** Flood, Cyclone, Fire, Landslide, Earthquake, Accident, and Other with 4-tier severity levels (Critical, High, Medium, Low).
- **Ground Media Attachment:** Photo evidence upload with live thumbnail preview.
- **Full Lifecycle Management:** Status triage transitions from `Reported` ➔ `Verified` ➔ `Responding` ➔ `In Progress` ➔ `Resolved`.

### 2. 🗺️ Interactive Emergency GIS Map (`/map`)
- **OpenStreetMap & Leaflet Integration:** Free, zero-API-key interactive map with smooth panning and zooming.
- **Color-Coded Severity Pins:** Custom dynamic DivIcons with pulsing radar effects for Critical hazards.
- **Rich Marker Popups:** Displays casualty estimates, required assistance, contact phone numbers, and direct dispatch links.
- **Hotspot Side Panel:** Live incident list with instant "Fly-to-Pin" locator navigation.
- **Filter Pills:** Instant filtering by hazard category (Flood, Cyclone, Fire, Accident, Critical) + Relief Center toggles.

### 3. 📦 Resource Stockpile Logistics (`/resources`)
- **Category Inventory:** Food, Drinking Water, Medicines, Blankets, Emergency Kits, Tents, Rescue Equipment, and Vehicles.
- **Visual Stock Gauges:** Real-time percentage meters indicating Available vs. Allocated supplies with low-stock warnings.
- **Allocation Dispatch Engine:** Allocate specific quantities of resources directly to incident operational zones.

### 4. 👥 Volunteer Coordination Force (`/volunteers` & `/volunteer`)
- **Skill-Based Roster:** First Aid, Medical, Water Rescue, Heavy Vehicle Driving, Food Distribution, and Comms.
- **Readiness State:** Switch between `Available`, `Assigned`, and `On Duty`.
- **Field Incident Assignment:** Assign specialized personnel to active emergencies with logged contact numbers and service hours.
- **Dedicated Volunteer Portal:** Responder checklist, active mission details, and zone emergency radar.

### 5. 🏠 Relief Centers & Shelters (`/shelters`)
- **Live Occupancy Tracking:** Animated capacity meters showing sheltered evacuees vs. free bed spaces.
- **Essential Facilities Matrix:** Water filtration, 24/7 kitchen meals, medical triage, backup generators, restrooms, and internet.
- **Quick GIS Directions:** Deep link from any shelter card directly to its location on the Emergency Map.

### 6. 📢 Emergency Public Alerts Broadcast (`/alerts`)
- **Multi-Level Warnings:** Advisory, Warning, Emergency, and Critical Red Alerts.
- **Top Notification Ticker:** High-priority alerts broadcasted prominently across all pages.
- **Public Safety Directives:** Step-by-step instructions for citizens (boil water notices, sea venture bans, evacuation routes).

### 7. 📊 Visual Analytics & Telemetry (`/analytics` & `/dashboard`)
- **6 Recharts Visualizations:**
  1. Incidents by Disaster Type (Bar Chart)
  2. Incidents & Mitigation Trajectory Over Time (Area Chart)
  3. Severity Distribution (Donut Chart)
  4. Resource Allocation vs. Stockpiles (Bar Chart)
  5. Volunteer Capabilities by Skill (Horizontal Bar Chart)
  6. Geographic Incident Density by District (Horizontal Bar Chart)
- **Time Window Filters:** Last 7 days, Last 30 days, Last 6 months, This year.

### 8. 👤 Multi-Role Portals & 1-Click Demo Logins (`/login` & `/register`)
- **Authority / Admin:** Emergency Operations Center (EOC) Command Dashboard.
- **Volunteer Responder:** Mission assignments, field checklists, and readiness status.
- **Citizen / Resident:** Instant SOS request, community reports tracker, and safe shelter finder.
- **1-Click Demo Logins:** Instant role switching for swift project viva demonstrations.

### 9. 🌓 Theme Customization & Local Storage Persistence
- **Dark Mode / Daylight Mode:** Full theme toggle with instantaneous CSS transition and localStorage memory.
- **Persistent State:** All CRUD updates (incidents, resources, volunteers, shelters, alerts) persist seamlessly in the browser.
- **Demo Data Reset Button:** One-click reset to restore the initial rich demo dataset at any time.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Core Framework** | React.js 19, Vite 8, JavaScript (ES6+ / JSX) |
| **Routing** | React Router DOM v7 (Clean SPA Routing & Query Params) |
| **Styling & Design** | Tailwind CSS v4, Custom Glassmorphism, CSS Pulse Keyframes |
| **Icons** | Lucide React |
| **Interactive Maps** | Leaflet 1.9, React Leaflet 5, OpenStreetMap Tiles |
| **Data Visualization** | Recharts 3.10 |
| **State & Storage** | React Context API, Custom `useLocalStorage` Hook |
| **Notifications** | Custom Toast Notification Engine |

---

## 📂 Project Architecture

```
resqnet/
├── public/
│   └── favicon.svg               # SVG Logo Pin Favicon
├── src/
│   ├── components/               # Reusable UI Components
│   │   ├── AlertCard.jsx         # Emergency Alert Broadcast Card
│   │   ├── Button.jsx            # Multi-Variant Action Buttons
│   │   ├── ConfirmDialog.jsx     # Destructive Action Safeguards
│   │   ├── EmptyState.jsx        # Empty State Graphics & CTAs
│   │   ├── IncidentTable.jsx     # Filterable Incident Directory
│   │   ├── LoadingSpinner.jsx    # Animated Radar Spinner
│   │   ├── MobileNav.jsx         # Mobile Bottom Navigation
│   │   ├── Modal.jsx             # Accessible Backdrop Dialogs
│   │   ├── Navbar.jsx            # Header with Ticker & Theme Toggle
│   │   ├── ResourceTable.jsx     # Inventory Levels & Dispatch Table
│   │   ├── ShelterCard.jsx       # Relief Shelter Capacity Card
│   │   ├── Sidebar.jsx           # Fixed / Responsive Operations Sidebar
│   │   ├── StatCard.jsx          # KPI Statistics Cards
│   │   ├── StatusBadge.jsx       # Severity & Status Color Pills
│   │   ├── Toast.jsx             # Global Floating Notifications
│   │   └── VolunteerTable.jsx    # Volunteer Capabilities & Dispatch
│   │
│   ├── context/
│   │   └── AppContext.jsx        # Centralized State, CRUD & Auth Provider
│   │
│   ├── data/                     # Realistic Preloaded Andhra Pradesh Mock Data
│   │   ├── alerts.js             # 8 Preloaded Regional Emergency Alerts
│   │   ├── incidents.js          # 16 Preloaded Disaster Incidents with GPS
│   │   ├── resources.js          # 14 Stockpile Inventory Items
│   │   ├── shelters.js           # 8 Operational Relief Centers
│   │   └── volunteers.js         # 16 Registered Field Responders
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js    # LocalStorage State Hook
│   │
│   ├── pages/                    # Application Views
│   │   ├── Alerts.jsx            # Alert Broadcast Center
│   │   ├── Analytics.jsx         # Telemetry & Recharts Visualizations
│   │   ├── CitizenDashboard.jsx  # Citizen Emergency Portal
│   │   ├── Dashboard.jsx         # Authority / EOC Command Center
│   │   ├── EmergencyMap.jsx      # Leaflet GIS Hazard Map
│   │   ├── Home.jsx              # High-Impact Landing Page
│   │   ├── Incidents.jsx         # Incidents Management Directory
│   │   ├── Login.jsx             # Auth & 1-Click Demo Logins
│   │   ├── Register.jsx          # Role Registration Form
│   │   ├── ReliefCenters.jsx     # Shelters Management
│   │   ├── ReportIncident.jsx    # Rapid Incident Reporting Form
│   │   ├── Resources.jsx         # Resource Inventory & Dispatch
│   │   ├── Settings.jsx          # Profile, Themes & Data Reset
│   │   └── VolunteerDashboard.jsx# Field Volunteer Portal
│   │
│   ├── utils/
│   │   └── helpers.js            # ID Generators, Date & Color Formatters
│   │
│   ├── App.jsx                   # Master Routes & Layout Wrappers
│   ├── index.css                 # Tailwind v4, Glass Styles & Animations
│   └── main.jsx                  # React DOM Root Entry
│
├── index.html                    # SEO Metadata & Font Imports
├── package.json                  # Dependencies & Scripts
├── tailwind.config.js
└── vite.config.js                # Vite + Tailwind Plugin Setup
```

---

## 🚀 Getting Started & How to Run

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation Steps

1. **Clone or Navigate to the Project Directory:**
   ```bash
   cd resqnet
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to the local URL displayed in the terminal:
   ```
   http://localhost:5173
   ```

5. **Build for Production (Optional):**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🧪 Demonstration & Viva Guide

When presenting ResQNet to evaluators:

1. **Landing Page (`/`):**
   - Highlight the live broadcast ticker at the top.
   - Walk through the core capabilities, lifecycle steps, and emergency helpline cards.
2. **1-Click Authentication (`/login`):**
   - Click **"Authority"** to enter the Emergency Operations Center.
   - Click **"Volunteer"** to view the task force assignment portal.
   - Click **"Citizen"** to test public SOS reporting.
3. **Emergency GIS Map (`/map`):**
   - Filter by **"Critical"** or **"Flood"** to see dynamic marker updates.
   - Click any marker to open popup cards with required resources and casualty numbers.
   - Click a shelter marker to view real-time free bed capacity.
4. **Report an Incident (`/report`):**
   - Submit a new incident with custom details and observe unique ID generation (`INC-2026-017`).
   - Notice how the report automatically reflects in the Incidents Directory, Emergency Map, and KPI cards.
5. **Resource Dispatch (`/resources`):**
   - Click **"Allocate"** on any item (e.g. *Inflatable Rescue Boats*) to dispatch units to an incident and watch available stock drop dynamically.
6. **Analytics (`/analytics`):**
   - Demonstrate multi-dimensional Recharts (timeline trends, severity donuts, volunteer skills breakdown).
7. **Dark Mode & Reset (`/settings`):**
   - Toggle Dark/Light themes and demonstrate the **"Reset to Demo Data"** feature.

---

## 🔮 Future Enhancements
- Integration with live weather radar APIs (e.g., IMD / OpenWeather).
- Offline Progressive Web App (PWA) caching for zero-connectivity field responders.
- SMS Gateway integration via Webhooks for automated broadcast dispatch.
- Multilingual voice-to-text reporting for localized regional dialects.

---

## 👥 Project Team
- **Frontend Development & UI/UX Design:** Student Project Team
- **Course:** Frontend Development Frameworks (B.Tech / MCA)
- **Year:** 2026
