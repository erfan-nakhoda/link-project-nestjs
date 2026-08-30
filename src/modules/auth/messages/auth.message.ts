export enum AuthErrorMessage  {
    usernameInvalid = "نام کاربری شما نامعتبر می باشد",
    confirmPasswordInvalid = "تایید رمز عبور با رمز عبور یکسان نمی باشدس",
    signUpDataInvalid = "نام کاربری یا رمز عبور اشتباه است",
    somthingWentWrong = "مشکلی پیش آمد",
    tokenInvalid = "توکن درست نمی باشد",
    loginAgain = "لطفا به حساب خود وارد شوید",
    alreadyLoggedOut = "شما قبلا از حساب خود خارج شدید",
    alreadyLoggedIn = "شما نیازی به ورود مجدد ندارید",
    forbidden = "شما دسترسی مورد نیاز را ندارید"
}

export enum AuthSuccessMessage {
    login = "شما با موفقیت وارد حساب کاربری خود شدید",
    signup =" حساب شما با موفقیت ایجاد شد لطفا وارد حساب خود شوید",
    logout = "شما با موفقیت از حساب خود خارج شدید"
}