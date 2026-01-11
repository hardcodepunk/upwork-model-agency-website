export const initialFormData = {
  fullName: "",
  age: "",
  instagram: "",
  onlyfans: "",
  email: "",
  honeypot: "",
}

export const requiredFields = ["fullName", "age", "instagram", "email"] satisfies ReadonlyArray<
  keyof typeof initialFormData
>
