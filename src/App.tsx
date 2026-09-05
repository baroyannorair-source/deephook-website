import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { useCursor, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import emailjs from '@emailjs/browser';

const famousSlogans = [
  "Apple: Think different",
  "Nike: Just do it",
  "Panasonic: Ideas for life",
  "Toyota: Always a better way",
  "Adidas: Impossible is nothing",
  "BMW: The Ultimate Driving Machine",
  "L'Oréal: Because you're worth it",
  "Mastercard: There are some things money can't buy.",
  "McDonald's: I'm lovin' it",
  "Disney: The happiest place on Earth",
  "Nike: Find your greatness",
  "KFC: Finger lickin' good",
  "Skittles: Taste the rainbow",
  "M&M's: Melts in your mouth, not in your hands",
  "Nokia: Connecting people",
  "Gillette: The best a man can get.",
  "Walmart: Save money. Live better.",
  "Energizer: It keeps going and going and going",
  "Kit Kat: Have a break, have a Kit Kat",
  "Red Bull: Gives you wings",
  "Mercedes-Benz: The best or nothing",
  "Pampers: Love, sleep & play",
  "Amazon: And you're done",
  "SNICKERS: You're not you when you're hungry."
];

// Dataset featuring vertical rectangles and squares with descriptions, image galleries, and YouTube links
const PORTFOLIO_WORKS = Array.from({ length: 24 }).map((_, i) => {
  const types = ['square', 'rect-v'] as const;
  const type = types[i % types.length];
  const tagList = ['Banner', 'Logo', 'Sticker', 'Flyer', 'Brand Identity'];
  const tag = tagList[i % tagList.length];

  return {
    id: i + 1,
    title: `Project Work 0${i + 1}`,
    type,
    tag,
    image: `https://picsum.photos/seed/deephookwork${i + 1}/600/750`,
    description: `Detailed creative breakdown for Project Work 0${i + 1}. Crafted with precision layouting, striking modern typography, and high-impact visual aesthetics tailored for commercial conversion.`,
    gallery: [
      `https://picsum.photos/seed/deephookwork${i + 1}_1/800/600`,
      `https://picsum.photos/seed/deephookwork${i + 1}_2/800/600`,
      `https://picsum.photos/seed/deephookwork${i + 1}_3/800/600`,
      `https://picsum.photos/seed/deephookwork${i + 1}_4/800/600`,
    ],
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
  };
});

// Mock Team Members Data with individual contact details and explicit social platforms
const TEAM_MEMBERS = [
  { 
    id: 1, 
    name: 'Vladimir Harutyunyan', 
    role: 'CEO, Co-Founder', 
    image: 'https://ik.imagekit.io/deephook/Gemini_Generated_Image_1el8zq1el8zq1el8.jfif', 
    bio: 'Head of the company with years of experience and a great sense of humor.',
    email: 'deephook.agency@gmail.com',
    phone: '+374 96 199111',
    socialPlatform: 'Telegram',
    socialUrl: 'https://t.me/Valosj90'
  },
  { 
    id: 2, 
    name: 'Baroyan Norayr', 
    role: 'Head of Marketing', 
    image: 'https://ik.imagekit.io/deephook/Noro.jpg', 
    bio: 'Specialising in real working marketing strategies that create a big client flow for business',
    email: 'baroyannorair@gmail.com',
    phone: '+374 98 608666',
    socialPlatform: 'Instagram',
    socialUrl: 'https://www.instagram.com/norayr_bar/'
  },
  { 
    id: 3, 
    name: 'Inesa Dolmazyan', 
    role: 'Senior Graphic Designer', 
    image: 'https://ik.imagekit.io/deephook/Ines.jpg', 
    bio: 'Creating stunning and brand identity and visuals for business that stands out',
    email: 'deephook.agency@gmail.com',
    phone: '+374 98 608666',
    socialPlatform: 'Instagram',
    socialUrl: 'https://www.instagram.com/inessad888/'
  },
  { 
    id: 4, 
    name: 'Ruzanna Hovhannisyan', 
    role: 'Project Manager', 
    image: 'https://ik.imagekit.io/deephook/Ruzik.jpg', 
    bio: 'Discipline and punctuality are the key to the success of the projects she manages.',
    email: 'hovhannisyanr091@gmail.com',
    phone: '+374 98 847450',
    socialPlatform: 'Instagram',
    socialUrl: 'https://www.instagram.com/ruzhovhannisyan11/'
  },
];

function SpatialNode({ 
  position, 
  imagePath,
  category,
  onClick, 
  isActive,
  isMobile 
}: { 
  position: [number, number, number], 
  imagePath: string,
  category: string,
  onClick: () => void, 
  isActive: boolean,
  isMobile: boolean
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const texture = useLoader(THREE.TextureLoader, imagePath);
  texture.colorSpace = THREE.SRGBColorSpace;

  const scale = isMobile ? 0.85 : 1;
  const boxArgs: [number, number, number] = [3.04 * scale, 3.84 * scale, 0.06];
  const planeArgs: [number, number] = [3 * scale, 3.8 * scale];

  useFrame((state) => {
    if (groupRef.current && !isActive) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.5 + position[0]) * 0.05;
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={position}>
  
      <RoundedBox 
        args={boxArgs} 
        radius={0.08} 
        smoothness={4}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      >
        <meshStandardMaterial color="#4d4d4d" roughness={0.3} metalness={0.4} />
      </RoundedBox>

      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={planeArgs} />
        <meshBasicMaterial map={texture} />
      </mesh>

      <Html position={[0, 0, 0.04]} center distanceFactor={7} zIndexRange={[100, 0]} pointerEvents="none">
        <div 
          style={{
            width: isMobile ? '180px' : '210px',
            height: isMobile ? '220px' : '266px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s ease-in-out',
            pointerEvents: 'none',
            borderRadius: '4px',
          }}
        >
          <span 
            style={{
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textAlign: 'center',
              padding: '0 10px',
              transform: hovered ? 'translateY(0px)' : 'translateY(8px)',
              transition: 'transform 0.25s ease-in-out',
            }}
          >
            {category}
          </span>
        </div>
      </Html>
    </group>
  );
}

function CameraController({ targetPosition, isMobile, isTablet }: { targetPosition: [number, number, number] | null, isMobile: boolean, isTablet: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    const defaultZ = isMobile ? 10 : isTablet ? 9.5 : 8;
    if (targetPosition) {
      gsap.to(camera.position, {
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
        duration: 1.2,
        ease: 'power3.inOut',
      });
    } else {
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: defaultZ,
        duration: 1.2,
        ease: 'power3.inOut',
      });
    }
  }, [targetPosition, camera, isMobile, isTablet]);

  return null;
}

export default function App() {
  // 404 Route state check: checks if pathname is something other than root or empty
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    const path = window.location.pathname;
    // Define valid routes (e.g. root '/' or empty)
    const validPaths = ['/', ''];
    if (!validPaths.includes(path)) {
      setIsNotFound(true);
    }
  }, []);

  const [currentSlogan, setCurrentSlogan] = React.useState('');
  const [displaySlogan, setDisplaySlogan] = React.useState('');

  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * famousSlogans.length);
    setCurrentSlogan(famousSlogans[randomIndex]);
  }, []);

  React.useEffect(() => {
    if (!currentSlogan) return;
    const sloganToType = currentSlogan;
    let i = 0;
    setDisplaySlogan('');
    
    const timer = setInterval(() => {
      if (i < sloganToType.length) {
        setDisplaySlogan(sloganToType.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentSlogan]);
  
  const [activeView, setActiveView] = useState<string | null>(null);
  const [camTarget, setCamTarget] = useState<[number, number, number] | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedWork, setSelectedWork] = useState<any | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [chatStep, setChatStep] = useState<'collect_contact' | 'chatting'>('collect_contact');
  const [contactInfo, setContactInfo] = useState<string>('');

  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const handleCardFlip = (id: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'Hello! Welcome to Deephook Agency. Before we start, please enter a valid email or phone number so our team can reach you.' }
  ]);
  const [inputText, setInputText] = useState<string>('');

  const blurOverlayRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const chatDrawerRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatDrawerRef.current) {
      if (isChatOpen) {
        gsap.to(chatDrawerRef.current, { x: '0%', duration: 0.5, ease: 'power3.out' });
      } else {
        gsap.to(chatDrawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
      }
    }
  }, [isChatOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const userInput = inputText.trim();
    setInputText('');

    if (chatStep === 'collect_contact') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
      const altPhoneRegex = /^\+?[0-9\s\-()]{7,15}$/;

      const isValidEmail = emailRegex.test(userInput);
      const isValidPhone = phoneRegex.test(userInput) || altPhoneRegex.test(userInput);
      const hasTooManyDots = (userInput.match(/\./g) || []).length > 2;

      if ((!isValidEmail && !isValidPhone) || hasTooManyDots) {
        setMessages((prev) => [
          ...prev,
          { sender: 'user', text: userInput },
          { sender: 'bot', text: '⚠️ Please enter a valid email address or phone number (e.g., name@example.com or +37400000000) to continue.' }
        ]);
        return; 
      }

      setContactInfo(userInput);
      setMessages((prev) => [
        ...prev,
        { sender: 'user', text: userInput },
        { sender: 'bot', text: 'Thank you! Now, how can we help you with your project?' }
      ]);
      setChatStep('chatting');
      return;
    }

    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);
    setIsSending(true);

    try {
      await emailjs.send(
        'service_nhojsr4',
        'template_bpxgvsi',
        {
          message: userInput,
          name: 'Website Visitor',
          user_contact: contactInfo,
          to_email: 'deephook.agency@gmail.com',
          reply_to: contactInfo.includes('@') ? contactInfo : 'deephook.agency@gmail.com',
        },
        'z6jILH_giu23Av-rU'
      );

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Thank you! Your message and contact details have been sent to our inbox. We will get back to you soon.' }
      ]);
    } catch (error) {
      console.error('Failed to send email:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Oops! Something went wrong while sending. Please try again or reach out via our social links.' }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleNodeClick = (id: string, categoryName: string, coords: [number, number, number]) => {
    setCurrentCategory(categoryName);
    
    if (blurOverlayRef.current) {
      gsap.to(blurOverlayRef.current, {
        backdropFilter: 'blur(25px)',
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
        onStart: () => {
          setCamTarget([coords[0], coords[1], coords[2] + 1.2]);
        },
        onComplete: () => {
          setActiveView(id);
          
          gsap.to(blurOverlayRef.current, {
            backdropFilter: 'blur(0px)',
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          });

          if (gridContainerRef.current) {
            gsap.fromTo(gridContainerRef.current.children, 
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.03, ease: 'power3.out' }
            );
          }
        }
      });
    }
  };

  const handleBackToSpatial = () => {
    if (blurOverlayRef.current) {
      gsap.to(blurOverlayRef.current, {
        backdropFilter: 'blur(25px)',
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setActiveView(null);
          setCamTarget(null);

          if (mainScrollRef.current) {
            mainScrollRef.current.style.scrollSnapType = 'none';
            mainScrollRef.current.scrollTop = window.innerHeight;
            
            setTimeout(() => {
              if (mainScrollRef.current) {
                mainScrollRef.current.style.scrollSnapType = 'y mandatory';
              }
            }, 50);
          }

          gsap.to(blurOverlayRef.current, {
            backdropFilter: 'blur(0px)',
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setCarouselIndex((prev) => (prev + 1) % 3);
      } else {
        setCarouselIndex((prev) => (prev - 1 + 3) % 3);
      }
    }
  };

  const nodePositions: Record<string, [number, number, number]> = {
    social: isMobile ? [ (0 - carouselIndex) * 4.5, 0, 0 ] : [-3.5, 0, 0],
    branding: isMobile ? [ (1 - carouselIndex) * 4.5, 0, 0 ] : [0, 0, 0],
    media: isMobile ? [ (2 - carouselIndex) * 4.5, 0, 0 ] : [3.5, 0, 0]
  };

  // CUSTOM 404 NOT FOUND RENDER CHECK
  if (isNotFound) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '24px', boxSizing: 'border-box', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.25, pointerEvents: 'none' }}>
          <img src="https://ik.imagekit.io/deephook/Firefly%20looped%20street%20timelapse%20people%20walking%20in%20front%20of%20the%20billboard%20%205333.gif" alt="BG" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '12px' }}>
            Error 404
          </span>
          <h1 style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', fontWeight: 300, letterSpacing: '0.1em', margin: '0 0 16px 0' }}>
            PAGE NOT FOUND
          </h1>
          <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '32px' }}>
            The spatial coordinates or page link you are looking for does not exist or has been relocated within Deephook Agency.
          </p>
          <a 
            href="/" 
            style={{
              background: '#fff',
              color: '#000',
              padding: '12px 28px',
              borderRadius: '99px',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'transform 0.2s ease',
            }}
          >
            RETURN HOME ↗
          </a>
        </div>
      </div>
    );
  }

  return (
    <div ref={mainScrollRef} style={{ width: '100vw', height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: '#0a0a0a', fontFamily: 'sans-serif', position: 'relative', scrollSnapType: 'y mandatory' }}>
      
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <img 
          src="https://ik.imagekit.io/deephook/Firefly%20looped%20street%20timelapse%20people%20walking%20in%20front%20of%20the%20billboard%20%205333.gif" 
          alt="Background Animation" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.45)' }} />
      </div>

      <div 
        ref={blurOverlayRef}
        style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 50, 
          pointerEvents: 'none', 
          opacity: 0, 
          backdropFilter: 'blur(0px)',
          background: 'rgba(0,0,0,0.4)'
        }} 
      />
<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'montserrat', color: '#fff', zIndex: 10, letterSpacing: '2px', textTransform: 'uppercase', pointerEvents: 'none' }}>
  {displaySlogan}
  <span style={{ opacity: 0.7 }}>|</span>
</div>
      <div style={{ width: '100vw', height: '100vh', scrollSnapAlign: 'start', position: 'relative', zIndex: 1, display: activeView ? 'none' : 'flex', alignItems: 'flex-end', padding: isMobile ? '20px' : '32px', boxSizing: 'border-box' }}>
        <div style={{ margin: '0 auto 40px auto', textAlign: 'center', opacity: 0.7, pointerEvents: 'none' }}>
          <span style={{ color: '#aaa', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll down for Services ↓</span>
        </div>
      </div>

      <div 
        style={{ width: '100vw', height: '100vh', scrollSnapAlign: 'start', position: 'relative', zIndex: 1, display: activeView ? 'none' : 'block', touchAction: 'pan-y' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div style={{ position: 'absolute', top: isMobile ? '75px' : '90px', width: '100%', textAlign: 'center', pointerEvents: 'none', zIndex: 5, padding: '0 16px', boxSizing: 'border-box' }}>
          <h2 style={{ color: '#fff', fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: 300, letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>
            Our Services
          </h2>
          <span style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {isMobile ? 'Swipe left/right to browse categories' : 'Interactive Portfolio'}
          </span>
        </div>

        <Canvas camera={{ position: [0, 0, isMobile ? 10 : isTablet ? 9.5 : 8], fov: 50 }} gl={{ alpha: true }}>
          <ambientLight intensity={1.8} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <pointLight position={[-10, -10, -5]} intensity={1.5} />
          
          <CameraController targetPosition={camTarget} isMobile={isMobile} isTablet={isTablet} />

          <SpatialNode 
            position={nodePositions.social} 
            imagePath="/images/deephook_Shopper.jpg" 
            category="Social Media"
            isActive={activeView === 'shopper'} 
            onClick={() => handleNodeClick('shopper', 'Social Media', nodePositions.social)} 
            isMobile={isMobile}
          />

          <SpatialNode 
            position={nodePositions.branding} 
            imagePath="/images/Pen.jpg" 
            category="Branding & Printing"
            isActive={activeView === 'pen'} 
            onClick={() => handleNodeClick('pen', 'Branding & Printing', nodePositions.branding)} 
            isMobile={isMobile}
          />

          <SpatialNode 
            position={nodePositions.media} 
            imagePath="/images/Stationary.jpg" 
            category="Media Production"
            isActive={activeView === 'merch'} 
            onClick={() => handleNodeClick('merch', 'Media Production', nodePositions.media)} 
            isMobile={isMobile}
          />
        </Canvas>

        {isMobile && (
          <div style={{ position: 'absolute', bottom: '60px', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 5, pointerEvents: 'none' }}>
            {[0, 1, 2].map((idx) => (
              <div 
                key={idx}
                style={{
                  width: carouselIndex === idx ? '24px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: carouselIndex === idx ? '#fff' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}

        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', opacity: 0.7 }}>
          <span style={{ color: '#aaa', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll for Team ↓</span>
        </div>
      </div>

      <div 
        style={{
          width: '100vw',
          height: '100vh',
          scrollSnapAlign: 'start',
          display: activeView ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '60px 16px' : '40px 32px',
          background: 'transparent',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
          overflowY: isMobile ? 'auto' : 'hidden'
        }}
      >
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          <h2 style={{ color: '#fff', fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
            Meet The Team
          </h2>
          <p style={{ color: '#aaa', fontSize: '0.8rem', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '8px' }}>
            The creative minds behind Deephook Agency
          </p>
          <p style={{ color: '#666', fontSize: '0.7rem', letterSpacing: '0.05em', textAlign: 'center', marginBottom: '24px', fontStyle: 'italic' }}>
            Click any card to flip and view direct contact info
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
            gap: '20px',
            maxHeight: isMobile ? '60vh' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible',
            paddingBottom: isMobile ? '20px' : '0'
          }}>
            {TEAM_MEMBERS.map((member) => {
              const isFlipped = !!flippedCards[member.id];
              return (
                <div
                  key={member.id}
                  onClick={() => handleCardFlip(member.id)}
                  style={{
                    perspective: '1000px',
                    height: isMobile ? '340px' : '380px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '8px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        style={{ width: isMobile ? '72px' : '100px', height: isMobile ? '72px' : '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '14px', border: '2px solid rgba(255,255,255,0.2)' }} 
                      />
                      <h3 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px' }}>
                        {member.name}
                      </h3>
                      <span style={{ color: '#ccc', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        {member.role}
                      </span>
                      <p style={{ color: '#aaa', fontSize: '0.7rem', lineHeight: '1.4', margin: 0, marginBottom: '10px' }}>
                        {member.bio}
                      </p>
                      <span style={{ fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', width: '100%' }}>
                        Click to view contact →
                      </span>
                    </div>

                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        background: 'rgba(20, 20, 20, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '8px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '2px solid rgba(255,255,255,0.2)' }} 
                      />
                      <h3 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '2px' }}>
                        {member.name}
                      </h3>
                      <span style={{ color: '#aaa', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                        Direct Contact Info
                      </span>

                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '6px' }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '8px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</span>
                          <a href={`mailto:${member.email}`} style={{ fontSize: '10px', color: '#fff', wordBreak: 'break-all', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                            {member.email}
                          </a>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '8px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phone</span>
                          <a href={`tel:${member.phone}`} style={{ fontSize: '10px', color: '#fff', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                            {member.phone}
                          </a>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '8px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Social Profile</span>
                          <a 
                            href={member.socialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{
                              display: 'inline-block',
                              background: '#1a1a1a',
                              border: '1px solid #333333',
                              color: '#ffffff',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 500,
                              textDecoration: 'none',
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {member.socialPlatform} ↗
                          </a>
                        </div>
                      </div>

                      <span style={{ fontSize: '9px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '10px' }}>
                        ← Click to flip back
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {activeView && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10,
            overflowY: 'auto',
            padding: isMobile ? '80px 16px 32px 16px' : '90px 32px 48px 32px',
            background: '#0c0c0c',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', maxWidth: '1600px', margin: '0 auto 20px auto', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => {
                  setSelectedTag('All');
                  setSearchQuery('');
                  handleBackToSpatial();
                }}
                style={{ background: '#222', color: '#fff', border: '1px solid #333', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.1em' }}
              >
                ← BACK
              </button>
              <h2 style={{ color: '#fff', fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
                {currentCategory}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="text"
                placeholder="Search works..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  outline: 'none',
                  width: isMobile ? '140px' : '200px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', maxWidth: '1600px', margin: '0 auto 20px auto', overflowX: 'auto', paddingBottom: '4px' }}>
            {['All', 'Banner', 'Logo', 'Sticker', 'Flyer', 'Brand Identity'].map((tag) => {
              const isActiveTag = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    background: isActiveTag ? '#fff' : 'rgba(255,255,255,0.05)',
                    color: isActiveTag ? '#000' : '#aaa',
                    border: '1px solid',
                    borderColor: isActiveTag ? '#fff' : 'rgba(255,255,255,0.1)',
                    padding: '6px 14px',
                    borderRadius: '99px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: isActiveTag ? 600 : 400,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div 
            ref={gridContainerRef}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
              gridAutoRows: isMobile ? '140px' : '180px',
              gap: '6px',
              maxWidth: '1600px',
              margin: '0 auto',
            }}
          >
            {PORTFOLIO_WORKS
              .filter((work) => {
                const matchesTag = selectedTag === 'All' || work.tag === selectedTag;
                const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) || work.tag.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesTag && matchesSearch;
              })
              .map((work) => {
                return (
                  <div
                    key={work.id}
                    style={{
                      gridRow: work.type === 'rect-v' ? 'span 2' : 'span 1',
                      gridColumn: 'span 1',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '4px',
                      background: '#1a1a1a',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                    onClick={() => {
                      setActiveGalleryIndex(0);
                      setSelectedWork(work);
                    }}
                  >
                    <img 
                      src={work.image} 
                      alt={work.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '10px',
                      }}
                    >
                      <span style={{ color: '#fff', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {work.title}
                      </span>
                      <span style={{ color: '#888', fontSize: '8px', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '2px' }}>
                        {work.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {selectedWork && (
        <div 
          onClick={() => setSelectedWork(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 80,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '16px' : '40px',
            boxSizing: 'border-box',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {selectedWork.title}
                </h2>
                <span style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Category Tag: {selectedWork.tag}
                </span>
              </div>
              <button 
                onClick={() => setSelectedWork(null)}
                style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '1.25rem', cursor: 'pointer', padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Project Overview
                </h3>
                <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                  {selectedWork.description}
                </p>
              </div>

              <div>
                <h3 style={{ color: '#fff', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Image Gallery ({activeGalleryIndex + 1} / {selectedWork.gallery.length})
                </h3>
                
                <div style={{ width: '100%', height: isMobile ? '240px' : '400px', borderRadius: '8px', overflow: 'hidden', background: '#000', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img 
                    src={selectedWork.gallery[activeGalleryIndex]} 
                    alt="Gallery Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {selectedWork.gallery.map((imgSrc: string, idx: number) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveGalleryIndex(idx)}
                      style={{
                        width: '80px',
                        height: '60px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: activeGalleryIndex === idx ? '2px solid #fff' : '2px solid transparent',
                        opacity: activeGalleryIndex === idx ? 1 : 0.6,
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <img src={imgSrc} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ color: '#fff', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Video Showcase
                </h3>
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <iframe 
                    src={selectedWork.youtubeUrl} 
                    title="YouTube video player" 
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <header style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '16px 20px' : '24px 32px', pointerEvents: 'none', boxSizing: 'border-box' }}>
     <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        window.location.href = '/';
      }}
    >
  <img
    src="/images/deephook-logo.png"
    alt="Deephook Logo"
    style={{ height: isMobile ? '22px' : '28px', objectFit: 'contain', pointerEvents: 'auto', cursor: 'pointer' }}
  />
</a>
        
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isMobile && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          )}
          <button 
            onClick={() => setIsChatOpen(true)}
            style={{ background: '#fff', color: '#000', padding: isMobile ? '8px 14px' : '10px 20px', borderRadius: '9999px', fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}
          >
            Message Us
          </button>
        </div>
      </header>

      {isMobile && isMenuOpen && (
        <div style={{ position: 'fixed', top: '65px', left: 0, width: '100vw', background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(12px)', zIndex: 19, padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 300, color: '#fff', margin: '0 0 4px 0' }}>DEEPHOOK AGENCY®</h2>
          <p style={{ fontSize: '0.7rem', color: '#a3a3a3', margin: '0 0 16px 0' }}>Immersive digital experiences & creative direction.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {[
              { label: 'Instagram', url: 'https://www.instagram.com/deephook.agency/' },
              { label: 'Facebook', url: 'https://www.facebook.com/people/DeepHook/61590312493042/' },
              { label: 'YouTube', url: 'https://www.youtube.com/@DeephookAgency' },
              { label: 'Behance', url: 'https://www.behance.net/Deephook_Agency' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                {social.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}

      {!isMobile && (
        <div style={{ position: 'fixed', bottom: '32px', left: '32px', zIndex: 20, pointerEvents: 'none', maxWidth: '400px', display: activeView ? 'none' : 'block' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 300, letterSpacing: '0.05em', color: '#fff', margin: 0 }}>DEEPHOOK AGENCY®</h1>
          <p style={{ fontSize: '0.75rem', color: '#a3a3a3', marginTop: '4px' }}>
            Immersive digital experiences and creative direction.
          </p>

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px', pointerEvents: 'auto' }}>
            {[
              { label: 'Instagram', url: 'https://www.instagram.com/deephook.agency/' },
              { label: 'Facebook', url: 'https://www.facebook.com/people/DeepHook/61590312493042/' },
              { label: 'YouTube', url: 'https://www.youtube.com/@DeephookAgency' },
              { label: 'Behance', url: 'https://www.behance.net/Deephook_Agency' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #333333',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                }}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {isChatOpen && (
        <div 
          onClick={() => setIsChatOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <div 
            ref={chatDrawerRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: isMobile ? '100vw' : '420px',
              maxWidth: '100%',
              height: '100%',
              background: '#121212',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              transform: 'translateX(100%)',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.1em', margin: 0, textTransform: 'uppercase' }}>
                  Project Inquiry
                </h3>
                <span style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Direct to Gmail Inbox</span>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '1.25rem', cursor: 'pointer', padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: msg.sender === 'user' ? '#fff' : 'rgba(255, 255, 255, 0.08)',
                    color: msg.sender === 'user' ? '#000' : '#fff',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    lineHeight: '1.4',
                    border: msg.sender === 'bot' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {isSending && (
                <div style={{ alignSelf: 'flex-start', color: '#666', fontSize: '0.75rem', fontStyle: 'italic', paddingLeft: '4px' }}>
                  Sending message to inbox...
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '10px', background: '#0e0e0e' }}>
              <input 
                type="text"
                placeholder={chatStep === 'collect_contact' ? 'Enter email or phone...' : 'Type your message...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isSending}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '12px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button 
                type="submit"
                disabled={isSending}
                style={{
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0 16px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: isSending ? 'not-allowed' : 'pointer',
                  opacity: isSending ? 0.6 : 1,
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
