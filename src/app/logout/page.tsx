import { SignOut } from "@/components/signout-form";

export default async function LogoutPage() {
    
    
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="w-full max-w-sm">
            <SignOut className="" />
        </div>
        </div>
    )
}