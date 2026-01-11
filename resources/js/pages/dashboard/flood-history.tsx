import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface Detection {
    id: number;
    original_image_url: string;
    mask_image_url: string;
    created_at: string;
    created_at_raw: string;
}

interface PaginatedDetections {
    data: Detection[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    detections: PaginatedDetections;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard/dashboard',
    },
    {
        title: 'Flood History',
        href: '/dashboard/flood-history',
    },
];

export default function FloodHistory({ detections }: Props) {
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url, { preserveState: true, preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Flood History" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border bg-white dark:bg-sidebar p-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                            Histori Deteksi Banjir
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Lihat semua hasil deteksi banjir yang telah Anda lakukan
                        </p>
                    </div>

                    {detections.data.length === 0 ? (
                        <div className="text-center py-20">
                            <Image className="w-24 h-24 mx-auto text-neutral-400 dark:text-neutral-600 mb-4" />
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                Belum Ada Histori Deteksi
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                Mulai deteksi banjir untuk melihat hasil di sini
                            </p>
                            <Button asChild>
                                <Link href="/">Mulai Deteksi</Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                                Menampilkan {detections.from} - {detections.to} dari {detections.total} hasil
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {detections.data.map((detection) => (
                                    <Card 
                                        key={detection.id} 
                                        className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    {detection.created_at}
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="relative aspect-square overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
                                                    <img 
                                                        src={detection.original_image_url} 
                                                        alt="Original" 
                                                        className="object-cover w-full h-full"
                                                    />
                                                    <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                        Asli
                                                    </div>
                                                </div>
                                                <div className="relative aspect-square overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-black">
                                                    <img 
                                                        src={detection.mask_image_url} 
                                                        alt="Mask" 
                                                        className="object-contain w-full h-full"
                                                    />
                                                    <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                        Mask
                                                    </div>
                                                </div>
                                            </div>
                                            <Button 
                                                asChild 
                                                className="w-full"
                                                variant="outline"
                                            >
                                                <Link href={`/dashboard/flood-history/${detection.id}`}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Detail
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {detections.last_page > 1 && (
                                <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-700 pt-6">
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Halaman {detections.current_page} dari {detections.last_page}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const prevLink = detections.links.find(link => link.label === '&laquo; Previous');
                                                handlePageChange(prevLink?.url || null);
                                            }}
                                            disabled={detections.current_page === 1}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Sebelumnya
                                        </Button>
                                        <div className="flex gap-1">
                                            {detections.links.map((link, index) => {
                                                if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                                    return null;
                                                }
                                                return (
                                                    <Button
                                                        key={index}
                                                        variant={link.active ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handlePageChange(link.url)}
                                                        disabled={!link.url}
                                                        className="min-w-[40px]"
                                                    >
                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const nextLink = detections.links.find(link => link.label === 'Next &raquo;');
                                                handlePageChange(nextLink?.url || null);
                                            }}
                                            disabled={detections.current_page === detections.last_page}
                                        >
                                            Selanjutnya
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

