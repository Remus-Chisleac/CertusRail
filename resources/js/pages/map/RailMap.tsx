import React from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePoll } from '@inertiajs/react';

// --- STYLES & CONFIGURATION ---

const containerStyle = {
    width: '100%',
    height: '100%', // Adjust height as needed
};

const defaultCenter = { lat: 46.784882, lng: 23.586945 };
const defaultZoom = 14;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Active Map',
        href: '/map', // Updated to a simple path
    },
];

// --- INTERFACES ---

interface Train {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
}

interface RailMapProps {
    trains: Train[];
    apiKey: string;
}

// --- CUSTOM MARKER COMPONENT ---

const CustomTrainMarker = ({ train }: { train: Train }) => {
    const position = {
        lat: parseFloat(train.latitude),
        lng: parseFloat(train.longitude),
    };

    return (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            {/* This wrapper div uses a CSS transform to position the marker correctly.
              - `translate(-50%, -100%)` moves the element left by half its width and up by its full height.
              - This effectively places the bottom-center of the element at the exact map coordinates.
            */}
            <div style={{ transform: 'translate(-50%, -100%)' }}>
                <div className="flex flex-col items-center">
                    {/* The label above the pin */}
                    <div className="bg-white shadow-md mb-1 px-2 py-1 rounded-md font-semibold text-black text-sm">
                        {train.name}
                    </div>
                    {/* The pin icon (SVG) */}
                    <svg
                        viewBox="0 0 32 32"
                        className="drop-shadow-lg w-8 h-8 text-blue-600"
                    >
                        <path
                            fill="currentColor"
                            d="M16 0C9.37 0 4 5.37 4 12c0 8 12 20 12 20s12-12 12-20C28 5.37 22.63 0 16 0zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
                        />
                        <circle fill="#fff" cx="16" cy="12" r="4" />
                    </svg>
                </div>
            </div>
        </OverlayView>
    );
};


// --- MAIN MAP COMPONENT ---

export default function RailMap({ trains, apiKey }: RailMapProps) {
    usePoll(1000, {
        // onStart: () => console.log('Polling for train data...'),
        // onFinish: () => console.log('Polling finished.'),
    });

    // Load the Google Maps script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
    });

    // --- RENDER LOGIC ---

    if (loadError) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="p-4 text-red-500">Error loading map. Please check the API key and network connection.</div>
            </AppLayout>
        );
    }

    if (!isLoaded) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="p-4 text-gray-500">Loading map…</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={defaultZoom}
            >
                {/* Map over the trains array and render a custom marker for each one */}
                {trains.map((train) => (
                    <CustomTrainMarker key={train.id} train={train} />
                ))}
            </GoogleMap>
        </AppLayout>
    );
}
