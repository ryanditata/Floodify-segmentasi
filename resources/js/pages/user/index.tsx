import { useForm, usePage, Head, router } from '@inertiajs/react';
import Lenis from "@studio-freight/lenis";
import { useEffect, useState,useRef, ChangeEvent, FormEvent } from 'react';
import { Upload, Brain, Zap, Globe, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function UserIndex() {
    const lenisRef = useRef<Lenis | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { props } = usePage<any>();
    const isAuthenticated = !!props.auth?.user;

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            });
        lenisRef.current = lenis;

        const raf = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        image: null as File | null,
    });
    
    const [preview, setPreview] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const resultImage = props.flash?.success?.mask_image;
    const successMessage = props.flash?.success?.message;

    useEffect(() => {
        if (resultImage && successMessage) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        }
    }, [resultImage, successMessage]);

    useEffect(() => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        }
    }, [errors]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);
            setPreview(URL.createObjectURL(file));
            setShowSuccess(false);
            setShowError(false);
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            router.visit('/login');
            return;
        }
        post(route('flood.detect'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('image');
            },
        });
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleStartDetection = () => {
        if (!isAuthenticated) {
            router.visit('/login');
        } else {
            scrollToSection('detection');
        }
    };

    return (
        <>
            {/* Alert Messages */}
            {showSuccess && successMessage && (
                <div className="fixed top-4 right-4 z-50 max-w-md">
                    <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle className="text-green-800 dark:text-green-200">Berhasil!</AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-300">
                            {successMessage}
                        </AlertDescription>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="absolute top-2 right-2 text-green-600 hover:text-green-800"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </Alert>
                </div>
            )}

            {(showError || Object.keys(errors).length > 0) && (
                <div className="fixed top-4 right-4 z-50 max-w-md">
                    <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertTitle className="text-red-800 dark:text-red-200">Error</AlertTitle>
                        <AlertDescription className="text-red-700 dark:text-red-300">
                            {(errors as any).api_error || (errors as any).connection_error || (errors as any).auth || Object.values(errors)[0] || 'Terjadi kesalahan'}
                        </AlertDescription>
                        <button
                            onClick={() => setShowError(false)}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </Alert>
                </div>
            )}

            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 animate-fade-in">
                            Flood Area Detection
                            <span className="block text-blue-600 dark:text-blue-400">with AI</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
                            Deteksi area banjir secara akurat menggunakan teknologi AI U-Net. 
                            Analisis gambar satelit dan foto udara untuk identifikasi area terdampak banjir dengan presisi tinggi.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                onClick={handleStartDetection}
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer rounded-full"
                            >
                                Mulai Deteksi
                            </Button>
                            {isAuthenticated && (
                                <Button
                                    onClick={() => router.visit('/dashboard/flood-history')}
                                    size="lg"
                                    variant="outline"
                                    className="px-8 py-6 text-lg font-semibold border-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 cursor-pointer rounded-full"
                                >
                                    Flood History
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-neutral-400 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-neutral-400 rounded-full mt-2"></div>
                    </div>
                </div>
            </section>

            {/* Cara Kerja */}
            <section id="cara-kerja" className="py-20 bg-white dark:bg-neutral-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                            Cara Kerja
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Proses deteksi banjir yang sederhana dan cepat dalam tiga langkah
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-neutral-800 dark:to-neutral-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Upload className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                Step 1: Upload Gambar
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Unggah gambar satelit atau foto udara area yang ingin dianalisis. Format yang didukung: JPG, PNG.
                            </p>
                        </div>
                        <div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-neutral-800 dark:to-neutral-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Brain className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                Step 2: AI U-Net Menganalisis
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Model AI U-Net memproses gambar menggunakan deep learning untuk mengidentifikasi area banjir.
                            </p>
                        </div>
                        <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-neutral-800 dark:to-neutral-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                Step 3: Area Banjir Ditampilkan
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Hasil segmentasi ditampilkan dengan area banjir yang terdeteksi ditandai dengan jelas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detection */}
            <section id="detection" className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50 dark:from-neutral-800 dark:to-neutral-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                            Deteksi Area Banjir
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Unggah gambar untuk memulai analisis menggunakan AI U-Net
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={submit} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 mb-8">
                            <div className="mb-6">
                                <label className="block mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                                    Upload Gambar
                                </label>
                                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                                    <input 
                                        type="file" 
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="image-upload"
                                        disabled={processing}
                                    />
                                    <label 
                                        htmlFor="image-upload" 
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <Upload className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mb-4" />
                                        <span className="text-neutral-600 dark:text-neutral-400 mb-2">
                                            Klik untuk mengunggah atau drag & drop
                                        </span>
                                        <span className="text-sm text-neutral-500 dark:text-neutral-500">
                                            PNG, JPG maksimal 2MB
                                        </span>
                                    </label>
                                </div>
                                {preview && (
                                    <div className="flex mt-4 text-sm text-green-600 dark:text-green-400">
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Gambar berhasil dipilih
                                    </div>
                                )}
                            </div>
                            
                            <Button 
                                type="submit" 
                                disabled={processing || !preview}
                                size="lg"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-full"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Sedang Memproses...
                                    </>
                                ) : (
                                    'Analisis Gambar'
                                )}
                            </Button>
                        </form>

                        {/* Results Grid */}
                        {(preview || resultImage) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {preview && (
                                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6">
                                        <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-200 flex items-center">
                                            <Upload className="w-5 h-5 mr-2" />
                                            Gambar Asli
                                        </h3>
                                        <div className="relative aspect-video overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
                                            <img 
                                                src={preview} 
                                                alt="Original" 
                                                className="object-cover w-full h-full" 
                                            />
                                        </div>
                                    </div>
                                )}

                                {resultImage && (
                                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6">
                                        <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-200 flex items-center">
                                            <Brain className="w-5 h-5 mr-2" />
                                            Hasil Segmentasi
                                        </h3>
                                        <div className="relative aspect-video overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-black">
                                            <img 
                                                src={resultImage} 
                                                alt="Result" 
                                                className="object-contain w-full h-full" 
                                            />
                                        </div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4 flex items-center">
                                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                                            Area putih menunjukkan prediksi banjir
                                        </p>
                                    </div>
                                )}

                                {processing && (
                                    <div className="col-span-2 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 text-center">
                                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                                        <p className="text-lg text-neutral-600 dark:text-neutral-400">
                                            AI sedang menganalisis gambar...
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Feature */}
            <section id="features" className="py-20 bg-white dark:bg-neutral-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                            Fitur Unggulan
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Teknologi canggih untuk deteksi banjir yang akurat dan cepat
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-neutral-800 dark:to-neutral-700 border border-blue-200 dark:border-neutral-600 hover:shadow-lg transition-all duration-300">
                            <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                AI U-Net
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Menggunakan model deep learning U-Net yang telah dilatih khusus untuk segmentasi area banjir
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-neutral-800 dark:to-neutral-700 border border-green-200 dark:border-neutral-600 hover:shadow-lg transition-all duration-300">
                            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                Akurasi Tinggi
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Hasil deteksi dengan tingkat akurasi tinggi untuk identifikasi area banjir yang presisi
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-neutral-800 dark:to-neutral-700 border border-purple-200 dark:border-neutral-600 hover:shadow-lg transition-all duration-300">
                            <Zap className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                Real-time Processing
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Proses analisis cepat dan real-time untuk mendapatkan hasil dalam hitungan detik
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-neutral-800 dark:to-neutral-700 border border-orange-200 dark:border-neutral-600 hover:shadow-lg transition-all duration-300">
                            <Globe className="w-12 h-12 text-orange-600 dark:text-orange-400 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                Berbasis Web
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Akses mudah melalui browser tanpa perlu instalasi aplikasi tambahan
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-900 dark:bg-black text-neutral-300 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Floodify</h3>
                        <p className="text-neutral-400 mb-4">
                            Flood Area Detection with AI
                        </p>
                        <p className="text-sm text-neutral-500">
                            © {new Date().getFullYear()} Floodify, All Rights Reserved
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
