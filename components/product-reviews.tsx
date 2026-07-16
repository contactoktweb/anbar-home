'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Star, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Review {
  _id: string
  userName: string
  rating: number
  comment: string
  imageUrl?: string
  _createdAt: string
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
  initialRating: number
  ratingCount: number
}

export function ProductReviews({ productId, reviews, initialRating, ratingCount }: ProductReviewsProps) {
  const router = useRouter()
  
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [userName, setUserName] = useState('')
  const [comment, setComment] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert("Por favor selecciona una calificación en estrellas.")
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('productId', productId)
    formData.append('userName', userName)
    formData.append('rating', rating.toString())
    formData.append('comment', comment)
    
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Error al enviar la reseña')
      }

      alert("¡Gracias! Tu reseña ha sido enviada exitosamente.")
      
      // Limpiar formulario
      setShowForm(false)
      setRating(0)
      setUserName('')
      setComment('')
      clearImage()
      
      // Recargar la página para ver la nueva reseña
      router.refresh()
      
    } catch (error) {
      console.error(error)
      alert("Hubo un error al enviar tu reseña. Intenta de nuevo más tarde.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-20 pt-16 border-t border-neutral-200">
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-neutral-900 mb-2">Reseñas de Clientes</h2>
            <div className="flex items-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={cn(
                      "w-5 h-5",
                      star <= Math.round(initialRating) ? "text-[#D4AF37] fill-[#D4AF37]" : "text-neutral-200 fill-neutral-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-neutral-600 font-light text-sm">
                {initialRating.toFixed(1)} de 5 ({ratingCount} {ratingCount === 1 ? 'valoración' : 'valoraciones'})
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 border border-neutral-300 text-sm font-medium uppercase tracking-widest text-neutral-800 hover:bg-neutral-50 transition-colors rounded-sm"
          >
            {showForm ? 'Cancelar' : 'Escribir una reseña'}
          </button>
        </div>

        {/* Formulario de Reseña */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-neutral-50 p-6 md:p-8 rounded-md mb-12 border border-neutral-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="font-serif text-xl mb-6 text-neutral-900">Tu opinión nos importa</h3>
            
            <div className="space-y-6">
              {/* Estrellas interactivas */}
              <div>
                <label className="block text-sm text-neutral-500 uppercase tracking-widest mb-2">Tu calificación *</label>
                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || rating)
                    return (
                      <Star
                        key={star}
                        className={cn(
                          "w-8 h-8 cursor-pointer transition-colors duration-200",
                          isFilled ? "text-[#D4AF37] fill-[#D4AF37]" : "text-neutral-300 hover:text-[#D4AF37]"
                        )}
                        onMouseEnter={() => setHoverRating(star)}
                        onClick={() => setRating(star)}
                        strokeWidth={1}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-neutral-500 uppercase tracking-widest mb-2">Tu Nombre *</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full border border-neutral-300 rounded-sm px-4 py-3 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all bg-white"
                    placeholder="Escribe tu nombre"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-neutral-500 uppercase tracking-widest mb-2">Imagen (Opcional)</label>
                  <div className="relative">
                    {!imagePreview ? (
                      <label className="flex items-center justify-center w-full h-[46px] border border-dashed border-neutral-300 rounded-sm cursor-pointer hover:bg-neutral-100 transition-colors bg-white">
                        <span className="flex items-center gap-2 text-sm text-neutral-500">
                          <Upload className="w-4 h-4" /> Subir foto
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center gap-4 bg-white border border-neutral-300 p-2 rounded-sm h-[46px]">
                        <div className="relative w-8 h-8 rounded-sm overflow-hidden shrink-0">
                          <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        </div>
                        <span className="text-xs text-neutral-500 truncate flex-1">{imageFile?.name}</span>
                        <button type="button" onClick={clearImage} className="p-1 hover:text-red-500 text-neutral-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-neutral-500 uppercase tracking-widest mb-2">Comentario *</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-neutral-300 rounded-sm px-4 py-3 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all resize-none bg-white"
                  placeholder="Cuéntanos qué te pareció el producto..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-camel-dark px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.1em] text-white hover:bg-neutral-900 transition-colors rounded-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
              </button>
            </div>
          </form>
        )}

        {/* Lista de Reseñas */}
        <div className="space-y-10">
          {reviews.length === 0 ? (
            <p className="text-neutral-500 font-light text-center py-12">
              Aún no hay reseñas para este producto. ¡Sé el primero en valorarlo!
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="border-b border-neutral-100 pb-10 last:border-0">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-neutral-900">{review.userName}</h4>
                      <span className="text-xs text-neutral-400 font-light">
                        {new Date(review._createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={cn(
                            "w-3.5 h-3.5",
                            star <= review.rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-neutral-200 fill-neutral-200"
                          )}
                        />
                      ))}
                    </div>
                    
                    <p className="text-neutral-600 font-light leading-relaxed text-[0.95rem]">
                      {review.comment}
                    </p>
                  </div>
                  
                  {review.imageUrl && (
                    <div className="sm:w-32 sm:h-32 w-full aspect-square relative rounded-sm overflow-hidden bg-neutral-100 shrink-0">
                      <Image 
                        src={review.imageUrl} 
                        alt={`Reseña de ${review.userName}`} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
