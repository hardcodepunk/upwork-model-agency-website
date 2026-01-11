export const APPLICATION_FORM_FIELDS = ["fullName", "age", "instagram", "email"] as const

export type ApplicationFormField = (typeof APPLICATION_FORM_FIELDS)[number]

export type ApplicationFormData = {
  fullName: string
  age: string
  instagram: string
  email: string
  onlyfans?: string
  honeypot?: string
  renderedAt?: number
  turnstileToken?: string
}

export const initialFormData: Required<
  Pick<ApplicationFormData, "fullName" | "age" | "instagram" | "email" | "onlyfans" | "honeypot">
> = {
  fullName: "",
  age: "",
  instagram: "",
  email: "",
  onlyfans: "",
  honeypot: "",
}
