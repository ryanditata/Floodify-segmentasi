import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, ChevronLeft } from 'lucide-react';

interface Detection {
    id: number;
    original_image_url: string;
    mask_image_url: string;
    created_at: string;
    created_at_raw: string;
}

interface Props {
    detection: Detection;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Flood History',
        href: '/dashboard/flood-history',
    },
    {
        title: 'Detail Flood History',
        href: '#',
    },
];

export default function FloodDetail({ detection }: Props) {
    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Flood History" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border bg-white dark:bg-sidebar p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                Detail Deteksi Banjir
                            </h1>
                            <p className="text-neutral-600 dark:text-neutral-400 flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {detection.created_at}
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/flood-history">
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Gambar Asli</span>
                                    <Button
                                        className='cursor-pointer'
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownload(detection.original_image_url, `original_${detection.id}.jpg`)}
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative aspect-video overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
                                    <img 
                                        src={detection.original_image_url} 
                                        alt="Original" 
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Hasil Segmentasi</span>
                                    <Button
                                        className='cursor-pointer'
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownload(detection.mask_image_url, `mask_${detection.id}.png`)}
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative aspect-video overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-black">
                                    <img 
                                        src={detection.mask_image_url} 
                                        alt="Mask" 
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                                    Area putih menunjukkan prediksi banjir yang terdeteksi oleh model AI U-Net.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

