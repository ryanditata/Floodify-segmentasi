# 🌊 Floodify - AI Flood Detection System

Floodify adalah aplikasi berbasis web untuk mendeteksi area banjir pada citra satelit atau foto udara menggunakan teknologi Deep Learning (U-Net).

<img width="1613" height="937" alt="Cuplikan layar 2026-01-15 175531" src="https://github.com/user-attachments/assets/3dff3c53-da35-43a1-9e6f-39accfa91664" />
<img width="1551" height="911" alt="Cuplikan layar 2026-01-15 175608" src="https://github.com/user-attachments/assets/6e8ceafe-bdff-4b62-9f59-38dc989f2bc9" />

## 🏗️ Tech Stack

### 🧠 AI & Machine Learning Service
- **Python 3.10+** - Core language for AI
- **FastAPI** - High-performance API framework
- **TensorFlow / Keras** - Deep Learning framework (U-Net Model)
- **NumPy & Pillow** - Image processing

### 🔙 Backend (Web)
- **Laravel 12.x** - PHP Framework
- **Inertia.js** - Modern monolith approach
- **SQLite Database** - Lightweight database solution

### 🎨 Frontend
- **React 18** - User interface library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Vite** - Fast build tool

## 🚀 Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ & NPM
- Python 3.10+ & PIP
- SQLite

### Step 1: Clone Repository

```bash
git clone https://github.com/ryanditata/Floodify-segmentasi.git
cd Floodify
```

### Step 2: Setup Web App (Laravel)

```bash
# Install PHP Dependencies
composer install

# Install Node.js Dependencies
npm install

# Environment Setup
cp .env.example .env
php artisan key:generate

# Database Setup
touch database/database.sqlite
php artisan migrate
php artisan db:seed
```

### Step 3: Setup AI Service (Python)

```bash
# Install Python Libraries Pastikan Anda berada di root folder project (atau folder tempat api.py berada).
pip install fastapi uvicorn tensorflow numpy pillow python-multipart

install file model: https://drive.google.com/file/d/13Wtra4GXFeejVji9DwRty-7PlLkXe0rY/view?usp=sharing

# Setup Model Pastikan file model .h5 sudah ada di lokasi yang benar:
models/model_unet_best.h5
```

### Step 4: Start Application

```bash
# Anda perlu menjalankan 3 terminal berbeda untuk menjalankan sistem secara penuh:
# Terminal 1: Laravel Server
php artisan serve

# Terminal 2: Frontend (Vite)
npm run dev

# Terminal 3: Python AI Service Jalankan service ini agar fitur deteksi berfungsi.
python -m uvicorn api:app --reload --port 8001
```

Aplikasi dapat diakses di: http://localhost:8000

## ⚙️ Configuration
```env
# ml_service Configuration
ML_API_URL=
```

## 📁 Project Structure

```
floodify/
├── app/
│   ├── Http/Controllers/          # Laravel controllers
│   ├── Models/                    # Eloquent models
│   └── Providers/                 # Service providers
├── database/
│   ├── migrations/                # Database migrations
│   ├── seeders/                   # Database seeders
│   └── factories/                 # Model factories
├── ml_service/
│   ├── models/model_unet_best.h5  # Folder penyimpanan Model (.h5)
│   └── api.py                     # Entry point Python AI Service
├── resources/
│   ├── js/                        # React/TypeScript frontend
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components
│   │   └── types/                 # TypeScript type definitions
│   └── css/                       # Stylesheets
├── routes/
│   ├── web.php                    # Web routes
│   └── auth.php                   # Authentication routes
└── public/                        # Public assets
```
