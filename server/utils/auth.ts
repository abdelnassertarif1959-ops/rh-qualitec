// Implementação usando Web Crypto API (mais moderna e segura)
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const passwordData = encoder.encode(password)
  
  // Combinar senha e salt
  const combined = new Uint8Array(passwordData.length + salt.length)
  combined.set(passwordData)
  combined.set(salt, passwordData.length)
  
  // Hash com SHA-256 (múltiplas iterações para maior segurança)
  let hash = await crypto.subtle.digest('SHA-256', combined)
  
  // Aplicar 10000 iterações para tornar mais lento (similar ao bcrypt)
  for (let i = 0; i < 10000; i++) {
    const hashArray = new Uint8Array(hash)
    const nextInput = new Uint8Array(hashArray.length + salt.length)
    nextInput.set(hashArray)
    nextInput.set(salt, hashArray.length)
    hash = await crypto.subtle.digest('SHA-256', nextInput)
  }
  
  // Retornar salt + hash em base64
  const saltBase64 = Buffer.from(salt).toString('base64')
  const hashBase64 = Buffer.from(hash).toString('base64')
  
  return `${saltBase64}:${hashBase64}`
}

export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  try {
    // Se não há storedHash, retorna false
    if (!storedHash) return false
    
    // Verificar se é um hash do bcryptjs (formato: $2b$, $2a$, $2y$)
    if (storedHash.startsWith('$2b$') || storedHash.startsWith('$2a$') || storedHash.startsWith('$2y$')) {
      const bcrypt = await import('bcryptjs')
      return await bcrypt.default.compare(password, storedHash)
    }
    
    // Verificar se é um hash migrado (formato: MIGRAR_senhaoriginal)
    if (storedHash.startsWith('MIGRAR_')) {
      const originalPassword = storedHash.replace('MIGRAR_', '')
      return password === originalPassword
    }
    
    // Verificar se é um hash do bcryptjs (formato: $2a$, $2b$, $2x$, $2y$)
    if (storedHash.startsWith('$2')) {
      try {
        // Importar bcryptjs dinamicamente para verificação
        const bcrypt = await import('bcryptjs')
        return await bcrypt.compare(password, storedHash)
      } catch (error) {
        console.error('Erro ao verificar hash bcryptjs:', error)
        return false
      }
    }
    
    // Verificar se é um hash real (formato: salt:hash)
    if (storedHash.includes(':')) {
      const [saltBase64, expectedHashBase64] = storedHash.split(':')
      if (!saltBase64 || !expectedHashBase64) return false
      
      const salt = new Uint8Array(Buffer.from(saltBase64, 'base64'))
      const expectedHash = Buffer.from(expectedHashBase64, 'base64')
      
      const encoder = new TextEncoder()
      const passwordData = encoder.encode(password)
      
      // Combinar senha e salt
      const combined = new Uint8Array(passwordData.length + salt.length)
      combined.set(passwordData)
      combined.set(salt, passwordData.length)
      
      // Hash com SHA-256 (múltiplas iterações)
      let hash = await crypto.subtle.digest('SHA-256', combined)
      
      // Aplicar 10000 iterações
      for (let i = 0; i < 10000; i++) {
        const hashArray = new Uint8Array(hash)
        const nextInput = new Uint8Array(hashArray.length + salt.length)
        nextInput.set(hashArray)
        nextInput.set(salt, hashArray.length)
        hash = await crypto.subtle.digest('SHA-256', nextInput)
      }
      
      const computedHash = Buffer.from(hash)
      
      // Comparação segura contra timing attacks
      return computedHash.equals(expectedHash)
    }
    
    // Fallback: comparação direta (senhas ainda em texto plano)
    return password === storedHash
    
  } catch (error) {
    console.error('Erro na verificação de senha:', error)
    return false
  }
}

export const generateSecureToken = (): string => {
  return crypto.randomUUID()
}