import { usePage, Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import axios from 'axios';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Security settings',
        href: '/settings/security',
    },
];

// --- Main Security Page Component ---
export default function Security() {
    const { auth } = usePage<SharedData>().props;
    const is2faEnabled = auth.user.google2fa_enabled;

    // Local state to manage the QR code display
    const [confirming, setConfirming] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);

    // Form for confirming the 2FA setup
    const {
        data: confirmData,
        setData: setConfirmData,
        post: postConfirm,
        processing: confirmingProcessing,
        errors: confirmErrors,
        reset: resetConfirmForm,
    } = useForm({ code: '' });

    // Form for disabling 2FA
    const {
        data: disableData,
        setData: setDisableData,
        post: postDisable,
        processing: disablingProcessing,
        errors: disableErrors,
        reset: resetDisableForm,
    } = useForm({ password: '' });


    const handleEnableClick = () => {
        // Use axios for this AJAX request. It's configured to send the CSRF token.
        axios.post(route('two-factor.enable')).then(response => {
            setQrCode(response.data.qrCodeSvg);
            setSecret(response.data.secret);
            setConfirming(true);
        });
    };

    const handleConfirmSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        postConfirm(route('two-factor.confirm'), {
            onSuccess: () => {
                setConfirming(false);
                setQrCode(null);
                setSecret(null);
                resetConfirmForm();
            },
        });
    };

    const handleDisableSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        postDisable(route('two-factor.disable'), {
            onSuccess: () => resetDisableForm(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Security settings" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Two-Factor Authentication"
                        description="Add an additional layer of security to your account by enabling two-factor authentication."
                    />
                    <>
                        {is2faEnabled && (
                            <div className="space-y-4">
                                <p className="font-medium text-green-600 text-sm">
                                    Two-factor authentication is currently enabled.
                                </p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Disable 2FA</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <form onSubmit={handleDisableSubmit}>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    To complete this action, please enter your current password.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="py-4">
                                                <Label htmlFor="password">Password</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={disableData.password}
                                                    onChange={(e) => setDisableData('password', e.target.value)}
                                                    required
                                                    autoComplete="current-password"
                                                    className="mt-1"
                                                />
                                                <InputError message={disableErrors.password} className="mt-2" />
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction type="submit" disabled={disablingProcessing}>
                                                    {disablingProcessing && <LoaderCircle className="mr-2 w-4 h-4 animate-spin" />}
                                                    Confirm & Disable
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </form>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </>

                    {/* --- STATE 2: USER IS ENABLING 2FA --- */}
                    {confirming && (
                        <div className="space-y-4">
                            <p className="text-muted-foreground text-sm">
                                To finish enabling two-factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key manually.
                            </p>
                            <div className="flex justify-start bg-white my-4 p-4 border rounded-lg" dangerouslySetInnerHTML={{ __html: qrCode || '' }} />
                            <p className="text-muted-foreground text-sm">Setup Key: <code className="bg-muted p-1 rounded font-mono">{secret}</code></p>

                            <form onSubmit={handleConfirmSubmit} className="space-y-4 mt-4 max-w-xl">
                                <div className="flex flex-col items-start">
                                    <Label htmlFor="code" className="mb-2">Verification Code</Label>
                                    <InputOTP
                                        id="code"
                                        maxLength={6}
                                        value={confirmData.code}
                                        onChange={(value) => setConfirmData('code', value)}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <InputError message={confirmErrors.code} className="mt-2" />
                                </div>
                                <Button type="submit" disabled={confirmingProcessing}>
                                    {confirmingProcessing && <LoaderCircle className="mr-2 w-4 h-4 animate-spin" />}
                                    Confirm
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* --- STATE 3: 2FA IS DISABLED --- */}
                    {!is2faEnabled && !confirming && (
                        <div className="space-y-4">
                            <p className="text-muted-foreground text-sm">
                                You have not enabled two-factor authentication.
                            </p>
                            <Button onClick={handleEnableClick}>Enable</Button>
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
