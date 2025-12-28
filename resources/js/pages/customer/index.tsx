import Lenis from "@studio-freight/lenis";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function CustomerIndex() {
    const [offsetY, setOffsetY] = useState(0);
    
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        const raf = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        const onScroll = (e: { scroll: number }) => setOffsetY(e.scroll);
        lenis.on("scroll", onScroll);

        return () => {
            lenis.off("scroll", onScroll);
            lenis.destroy();
        };
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
    };

    return (
        <>
        <h1 className="flex justify-center font-bold">Ini Halaman LandingPage</h1>
        </>
    );
}
