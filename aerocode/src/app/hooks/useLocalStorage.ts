import { useState, useEffect } from 'react'

// O <T> é o que chamamos de "Generics" no TypeScript. 
// Ele permite que esse mesmo código sirva para gerenciar Aeronaves, Funcionários, Peças... qualquer coisa!
export function useLocalStorage<T>(key: string, initialValue: T) {
    
    // 1. Inicializa o estado lendo do navegador ou usando o mock inicial
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            // O Next.js roda no servidor primeiro, onde não existe 'window' ou 'localStorage'.
            // Essa verificação evita que o seu projeto quebre!
            if (typeof window === "undefined") {
                return initialValue
            }
            
            const item = window.localStorage.getItem(key)
            // Se encontrou dados salvos, transforma de texto (JSON) para Objeto. Se não, usa o Mock.
            return item ? JSON.parse(item) : initialValue
        } 
        catch (error) {
            console.error("Erro ao ler do localStorage", error)
            return initialValue
        }
    })

    // 2. Toda vez que o 'storedValue' for alterado em alguma tela, salva automaticamente no navegador
    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(storedValue))
            }
        } 
        catch (error) {
            console.error("Erro ao salvar no localStorage", error)
        }
    }, [key, storedValue])

    return [storedValue, setStoredValue] as const
}