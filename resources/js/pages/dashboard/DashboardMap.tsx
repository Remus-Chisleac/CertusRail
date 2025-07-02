import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Skeleton } from '@/components/ui/skeleton';
import { router } from '@inertiajs/react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';


const containerStyle = {
    width: '100%',
    height: '100%',
};

const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    gestureHandling: 'none',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
};

const defaultZoom = 15;

const locations = [
    { name: 'Cluj-Napoca Train Station', coords: { lat: 46.78488214608525, lng: 23.586945868534503 } },
    { name: 'Suceava Train Station', coords: { lat:47.66967075444584,  lng: 26.267566115233503 } },
    { name: 'Bucharest North Train Station', coords: { lat: 44.44925976248736,  lng: 26.069552278281233 } },
];


export default function DashboardMap({ apiKey }: { apiKey: string }) {
    const {isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
    });

    // const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
    const [currentLocationIndex] = useState(0);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setCurrentLocationIndex((prevIndex) => (prevIndex + 1) % locations.length);
    //     }, 10000);

    //     return () => clearInterval(intervalId);
    // }, []);

    useEffect(() => {
        if (map) {
            const newCenter = locations[currentLocationIndex].coords;
            map.panTo(newCenter);
        }
    }, [map, currentLocationIndex]);

    const onLoad = useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    if (loadError) {
        return <PlaceholderPattern className="absolute inset-0 stroke-neutral-900/20 dark:stroke-neutral-100/20 size-full" />;
    }

    if (!isLoaded) {
        return <Skeleton className="rounded-xl w-full h-full" />;
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={locations[0].coords}
            zoom={defaultZoom}
            options={mapOptions}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={() => router.visit('/map')}
        >
        </GoogleMap>
    );
}
