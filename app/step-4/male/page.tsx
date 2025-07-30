"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Lock, CheckCheck, MapPin, AlertTriangle } from "lucide-react"
import Image from "next/image"

// Componente do mapa que agora recebe a localização via props para ser dinâmico.
const RealtimeMap = ({ lat, lng, city, country }: { lat: number; lng: number; city: string; country: string }) => {
  // Constrói a URL do Google Maps com as coordenadas recebidas.
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=13&output=embed`

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-inner">
      <iframe
        className="absolute top-0 left-0 w-full h-full border-0"
        loading="lazy"
        allowFullScreen
        src={mapEmbedUrl}
      ></iframe>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="bg-gray-800/80 text-white text-xs font-bold py-1 px-3 rounded">GPS TRACKING</span>
          <span className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded">LIVE</span>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute h-20 w-20 rounded-full bg-red-600/30 animate-ping"></div>
          <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-red-600 border-2 border-white shadow-xl">
            <MapPin className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="text-white">
          <div className="flex items-center gap-2 font-bold text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span>SUSPICIOUS ACTIVITY DETECTED</span>
          </div>
          {/* Exibe a localização dinâmica recebida pelas props */}
          <p className="text-sm text-gray-200">Location: {city}, {country}</p>
          <p className="text-sm text-gray-200">Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}</p>
          <p className="text-xs text-gray-300">Device was tracked to this area</p>
        </div>
      </div>
    </div>
  )
}

// Define a estrutura de uma mensagem individual.
type Message = {
  type: "incoming" | "outgoing"
  content: string
  time: string
  isBlocked?: boolean
}

// Componente do Popup do Chat (sem alterações necessárias).
const ChatPopup = ({
  onClose,
  profilePhoto,
  conversationData,
  conversationName,
}: {
  onClose: () => void
  profilePhoto: string | null
  conversationData: Message[]
  conversationName: string
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-teal-600 text-white p-3 flex items-center gap-3">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-teal-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={
                profilePhoto ||
                "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
              }
              alt="Profile"
              width={40}
              height={40}
              className="object-cover h-full w-full"
              unoptimized
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{conversationName.replace("🔒", "").trim()}</span>
            {conversationName.includes("🔒") && <Lock className="h-4 w-4" />}
          </div>
        </div>

        {/* Corpo do Chat */}
        <div className="bg-gray-200 p-4 space-y-4 h-[28rem] overflow-y-scroll">
          {conversationData.map((msg, index) =>
            msg.type === "incoming" ? (
              <div key={index} className="flex justify-start">
                <div className="bg-white rounded-lg p-3 max-w-[80%] shadow">
                  <p className={`text-sm ${msg.isBlocked ? "font-semibold text-red-500" : "text-gray-800"}`}>
                    {msg.content}
                  </p>
                  <p className="text-right text-xs text-gray-400 mt-1">{msg.time}</p>
                </div>
              </div>
            ) : (
              <div key={index} className="flex justify-end">
                <div className="bg-lime-200 rounded-lg p-3 max-w-[80%] shadow">
                  <p className={`text-sm ${msg.isBlocked ? "font-semibold text-red-500" : "text-gray-800"}`}>
                    {msg.content}
                  </p>
                  <div className="flex justify-end items-center mt-1">
                    <span className="text-xs text-gray-500 mr-1">{msg.time}</span>
                    <CheckCheck className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Rodapé */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-center bg-gradient-to-t from-white via-white/95 to-transparent">
          <p className="text-gray-700 font-medium">To view the full conversation, you need to unlock the chats.</p>
        </div>
      </div>
    </div>
  )
}

// Componente principal da página.
export default function Step4Male() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [selectedConvoIndex, setSelectedConvoIndex] = useState<number | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; city: string; country: string } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)

  const defaultLocation = {
    lat: -23.5505,
    lng: -46.6333,
    city: "São Paulo",
    country: "Brazil",
  }

  // Bloco useEffect corrigido para usar a API Route interna.
  useEffect(() => {
    const storedPhoto = localStorage.getItem("profilePhoto")
    setProfilePhoto(
      storedPhoto ||
      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
    )

    const fetchLocation = async () => {
      try {
        // =======================================================
        //     MUDANÇA PRINCIPAL AQUI                              
        // Chamando a nossa própria API Route em vez da externa.
        // =======================================================
        const response = await fetch('/api/location');

        if (!response.ok) {
          throw new Error(`A resposta da nossa API interna não foi ok. Status: ${response.status}`);
        }

        const data = await response.json();
        
        // A lógica de tratamento dos dados permanece a mesma, pois nossa API
        // repassa os dados da ip-api.com.
        if (data.lat && data.lon) {
          setLocation({
            lat: data.lat,
            lng: data.lon,
            city: data.city,
            country: data.country,
          });
        } else {
          console.warn("API interna não retornou os dados esperados.", data.error);
          setLocation(defaultLocation);
        }
      } catch (error) {
        console.error("Falha ao buscar localização da API interna:", error);
        setLocation(defaultLocation);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchLocation();
  }, []); // O array vazio assegura que isso execute apenas uma vez.

  // --- Seus dados estáticos (sem alterações) ---
  const maleImages = [
    "/images/male/4.png", "/images/male/7.png", "/images/male/6.png",
    "/images/male/5.png", "/images/male/9.png", "/images/male/8.png",
  ];

  const conversations = [
    {
      img: "/images/male/3.png", name: "Blocked 🔒", msg: "Recovered deleted message", time: "Yesterday", popupName: "Blocked 🔒",
      chatData: [
        { type: "incoming", content: "Hi, how are you?", time: "2:38 PM" },
        { type: "outgoing", content: "I'm good, and you?", time: "2:40 PM" },
        { type: "incoming", content: "Blocked content", time: "2:43 PM", isBlocked: true },
        { type: "outgoing", content: "Blocked content", time: "2:43 PM", isBlocked: true },
      ] as Message[],
    },
    {
      img: "/images/male/303.png", name: "Blocked 🔒", msg: "Suspicious audio detected", time: "2 days ago", popupName: "Blocked",
      chatData: [
        { type: "incoming", content: "Hey handsome", time: "10:21 PM" },
        { type: "outgoing", content: "I'm here, my love", time: "10:27 PM" },
        { type: "incoming", content: "Blocked content", time: "10:29 PM", isBlocked: true },
      ] as Message[],
    },
    {
      img: "/images/male/331.png", name: "Blocked 🔒", msg: "Suspicious photos found", time: "3 days ago", popupName: "Blocked",
      chatData: [
        { type: "incoming", content: "Hi, how have you been?", time: "11:45 AM" },
        { type: "outgoing", content: "I'm fine, thanks! What about you?", time: "11:47 AM" },
        { type: "incoming", content: "Blocked content", time: "11:50 AM", isBlocked: true },
      ] as Message[],
    },
  ];

  const suspiciousKeywords = [
    { word: "Naughty", count: 13 }, { word: "Love", count: 22 }, { word: "Secret", count: 7 },
    { word: "Hidden", count: 11 }, { word: "Don't tell", count: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-500 text-white text-center py-4">
        <h1 className="text-xl font-bold">WhatsApp Access Report Profile</h1>
        <p className="text-sm opacity-90">Check below the most relevant from the analysis of the personal mobile</p>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* User Detectado */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Detected user</h2>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {profilePhoto && (
                <Image src={profilePhoto} alt="WhatsApp Profile" width={80} height={80} className="object-cover h-full w-full" unoptimized />
              )}
            </div>
          </div>
        </div>

        {/* Análise de Conversas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Conversation Analysis</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold text-red-500">148 suspicious conversations</span> were found. The system recovered <span className="font-semibold text-orange-500">deleted messages</span>.
          </p>
          <div className="space-y-3">
            {conversations.map((convo, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setSelectedConvoIndex(index)}>
                <div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden"><Image src={convo.img} alt="Profile" width={32} height={32} className="object-cover h-full w-full" /></div><div><p className="font-medium text-sm">{convo.name}</p><p className="text-xs text-gray-500">{convo.msg}</p></div></div><span className="text-xs text-gray-400">{convo.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mídia Recuperada */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Recovered Media</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold text-red-500">5 compromising audios</span> and <span className="font-semibold text-red-500">247 deleted photos</span> were found.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {maleImages.map((image, index) => (
              <div key={index} className="aspect-square relative rounded-lg overflow-hidden"><Image src={image} alt={`Recovered media ${index + 1}`} fill className="object-cover" /></div>
            ))}
          </div>
        </div>

        {/* Palavras-chave Suspeitas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div><h2 className="text-lg font-semibold text-gray-800">Suspicious Keywords</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">The system scanned <span className="font-semibold text-red-500">4,327 messages</span> and identified several keywords.</p>
          <div className="space-y-1">
            {suspiciousKeywords.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-200"><span className="text-lg text-gray-800">"{item.word}"</span><div className="flex items-center justify-center w-7 h-7 bg-green-500 rounded-full text-white text-sm font-bold">{item.count}</div></div>
            ))}
          </div>
        </div>

        {/* Localização Suspeita com Mapa */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div><h2 className="text-lg font-semibold text-gray-800">Suspicious Location</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">The device location was tracked. Check below:</p>
          {isLoadingLocation ? (
            <div className="text-center p-10 text-gray-500 h-96 flex items-center justify-center"><p>Detecting location based on your connection...</p></div>
          ) : (
            <RealtimeMap
              lat={location?.lat ?? defaultLocation.lat}
              lng={location?.lng ?? defaultLocation.lng}
              city={location?.city ?? defaultLocation.city}
              country={location?.country ?? defaultLocation.country}
            />
          )}
        </div>

        {/* Display do Celular e Texto de Venda */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4"><div className="relative"><Image src="/images/celulares.webp" alt="Phone" width={300} height={300} className="object-contain" unoptimized /></div></div>
          <div className="space-y-4 text-sm text-gray-600"><p><strong>You have reached the end of your free consultation.</strong></p><p>Our satellite tracking system is the most advanced technology to find out what’s going on. But there’s a catch: keeping the satellites and servers running 24/7 is expensive.</p><p>The good news? You don’t have to spend a fortune to hire a private investigator.</p><p>It’s time to stop guessing and find out the truth. The answers are waiting for you. Click now and get instant access – before it’s too late!</p></div>
        </div>

        {/* Desconto Exclusivo */}
        <div className="bg-[#0A3622] text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center">EXCLUSIVE DISCOUNT</h2>
          <div className="text-xl text-red-400 line-through text-center my-2">$197</div>
          <div className="text-4xl font-bold mb-4 text-center">$47</div>
          <div className="space-y-2 text-sm mb-6 text-left"><div className="flex items-center gap-4"><img src="/images/icone-check.png" alt="Ícone de verificação" className="h-8 w-8" /><span>This person recently communicated whith 3 people from (IP)</span></div><div className="flex items-center gap-4"><img src="/images/icone-check.png" alt="Ícone de verificação" className="h-8 w-8" /><span>Our AI detected a suspicious message</span></div><div className="flex items-center gap-4"><img src="/images/icone-check.png" alt="Ícone de verificação" className="h-8 w-8" /><span>It was deteced that this person viewed the status of contact ****** 6 times today</span></div><div className="flex items-center gap-4"><img src="/images/icone-check.png" alt="Ícone de verificação" className="h-8 w-8" /><span>It was detected that this person archived 2 conversations yesterday</span></div></div>
          <a href="https://pay.mundpay.com/01982eae-80c3-70d5-ac4c-5d97f149e0e3?ref=" target="_blank" rel="noopener noreferrer" className="block w-full rounded-full bg-[#26d366] py-3 text-lg font-bold text-white text-center shadow-[0_4px_12px_rgba(38,211,102,0.3)] transition duration-150 ease-in-out hover:bg-[#22b858] hover:shadow-lg">BUY NOW →</a>
        </div>

        {/* Garantia de 30 Dias */}
        <div className="text-center py-8"><img src="/images/30en.png" alt="Selo de 30 dias de garantia" className="w-64 h-64 block mx-auto" /></div>
      </div>

      {/* Renderização condicional do popup de chat */}
      {selectedConvoIndex !== null && (
        <ChatPopup
          onClose={() => setSelectedConvoIndex(null)}
          profilePhoto={conversations[selectedConvoIndex].img}
          conversationData={conversations[selectedConvoIndex].chatData}
          conversationName={conversations[selectedConvoIndex].popupName}
        />
      )}
    </div>
  )
}
