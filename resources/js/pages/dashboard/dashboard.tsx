import { Head, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScanLine, Calendar, GalleryVerticalEnd, Activity, CalendarFold } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard/dashboard',
    },
]

export default function Dashboard({ user, stats, recent, system }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-4 space-y-4">
                <Card className="bg-white dark:bg-sidebar">
                    <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Selamat datang,{' '}
                                <span className="text-blue-600">
                                    {user.name}
                                </span>
                            </h1>
                            <p className="mt-2">
                                Siap mendeteksi area banjir hari ini?
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                className="cursor-pointer"
                                variant="outline"
                                onClick={() =>
                                    router.visit('/dashboard/flood-history')
                                }
                            >
                                < GalleryVerticalEnd className="h-4 w-4" />
                            </Button>
                            <Button
                                className="cursor-pointer"
                                onClick={() => router.visit('/')}
                            >
                                <ScanLine className="h-4 w-4" />
                                Deteksi
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-lg">
                                Total Deteksi
                            </CardTitle>
                            <GalleryVerticalEnd className="h-8 w-8 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {stats.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Seluruh deteksi yang pernah dilakukan
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-lg">
                                Deteksi Bulan Ini
                            </CardTitle>
                            <CalendarFold className="h-8 w-8 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {stats.month}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Aktivitas deteksi bulan berjalan
                            </p>
                        </CardContent>
                    </Card>

                    <Card className={stats.today > 0 ? "border-blue-200 bg-blue-50 dark:bg-blue-900/10" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle
                                className={`text-lg ${
                                    stats.today > 0 ? "text-blue-600" : ""
                                }`}
                            >
                                Deteksi Hari Ini
                            </CardTitle>
                            <Activity
                                className={`h-8 w-8 ${
                                    stats.today > 0 ? "text-blue-600" : "text-muted-foreground"
                                }`}
                            />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-3xl font-bold ${
                                    stats.today > 0 ? "text-blue-600" : ""
                                }`}
                            >
                                {stats.today}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Deteksi yang dilakukan hari ini
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>Deteksi Terakhir</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {recent.length === 0 ? (
                            <p className="text-muted-foreground">
                                Belum ada aktivitas deteksi.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {recent.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="rounded-lg border overflow-hidden hover:shadow transition"
                                    >
                                        <img
                                            src={item.original}
                                            className="h-24 w-full object-cover"
                                            alt="Original"
                                        />
                                        <img
                                            src={item.mask}
                                            className="h-24 w-full object-cover"
                                            alt="Mask"
                                        />

                                        <div className="flex items-center justify-center gap-1 p-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {item.created_at}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
