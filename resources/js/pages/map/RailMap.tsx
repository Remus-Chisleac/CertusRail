import React from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'

const containerStyle = { width: '100%', height: '100%' }
const defaultCenter = { lat: 46.7788111, lng: 23.6150649 }    // change to your region
const defaultZoom = 13                  // change as desired

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Active Map',
        href: '',
    },
];

export default function RailMap({apiKey}: { apiKey: string }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
    })

    if (loadError) return <div>Error loading map</div>
    if (!isLoaded) return <div>Loading map…</div>

    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={defaultZoom}
            >
                {/* nothing here yet */}
            </GoogleMap>
        </AppLayout>
    )
}
