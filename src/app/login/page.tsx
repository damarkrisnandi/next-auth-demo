import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
