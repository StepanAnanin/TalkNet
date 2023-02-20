const RegExps = {
    isEmail: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
    isPassword: /^[a-яa-z0-9@#$%^&*()_+={};:'"?><.,~`!-]*$/i,
} as const;

export default RegExps;
