/**
 * Utilitário para compressão de imagens no navegador antes do upload.
 * Resolve a limitação de payload de 4.5MB da Vercel para fotos tiradas do celular.
 */
export async function compressImageIfNeeded(file: File, maxSide = 1920, quality = 0.7): Promise<File> {
  // Se não for imagem, retornar o arquivo original
  if (!file.type.startsWith('image/')) {
    return file
  }

  // Se o arquivo for menor que 1.5MB, não há necessidade de comprimir
  if (file.size < 1.5 * 1024 * 1024) {
    return file
  }

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Redimensionar mantendo proporção se exceder o tamanho máximo
        if (width > height) {
          if (width > maxSide) {
            height = Math.round((height * maxSide) / width)
            width = maxSide
          }
        } else {
          if (height > maxSide) {
            width = Math.round((width * maxSide) / height)
            height = maxSide
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              console.log(`📸 [COMPRESSOR] Imagem comprimida de ${(file.size / 1024 / 1024).toFixed(2)}MB para ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          file.type,
          quality
        )
      }
      img.src = e.target?.result as string
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}
