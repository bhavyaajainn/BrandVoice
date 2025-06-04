export interface Integration {
    id: string
    name: string
    description: string
    icon: React.ReactNode
    category: string
    isIntegrated: boolean
    fields: {
        name: string
        label: string
        type: string
        required: boolean
        placeholder: string
        description?: string
    }[]
    color: string
}
