import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import InputError from '@/components/input-error';

export default function TwoFactorChallenge() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.verify'));
    };

    return (
        <AuthLayout
            title="Two-Factor Challenge"
            description="Please enter the code from your authenticator app to complete login."
        >
            <Head title="2FA Verification" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="gap-6 grid">
                    <div className="justify-center gap-2 grid">
                        <InputOTP
                            id="code"
                            maxLength={6}
                            value={data.code}
                            onChange={(value) => setData('code', value)}
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
                        <InputError message={errors.code} className="mt-2 text-center" />
                    </div>

                    <Button type="submit" className="mt-4 w-full" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 w-4 h-4 animate-spin" />}
                        Verify
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
