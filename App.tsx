
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CheckCircle, 
  ChevronDown, 
  Copy, 
  ShieldCheck, 
  Trophy, 
  Zap, 
  Globe, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  LayoutGrid,
  Gift,
  AlertCircle,
  Calculator,
  Coins,
  Menu,
  X,
  Info
} from 'lucide-react';

// --- Constants ---
const REFERRAL_CODE = "BITUNIXBONUS";
const REGISTER_URL = `https://www.bitunix.com/register?inviteCode=ab9nr3&vipCode=${REFERRAL_CODE}`;
const VIP_PLAN_URL = `https://www.bitunix.com/register?inviteCode=ab9nr3&vipCode=${REFERRAL_CODE}&utm_campaign=3rdparty-vip-plan`;
const ANNIVERSARY_URL = `https://www.bitunix.com/register?inviteCode=ab9nr3&vipCode=${REFERRAL_CODE}&utm_campaign=3rdparty-anniversary`;

// --- Components ---

const BitunixLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 108 24" 
    fill="none" 
    className={className} 
    preserveAspectRatio="xMidYMid meet"
  >
    <path d="M21.8073 3.17745C22.1029 3.17745 22.3252 3.44684 22.2692 3.73702L20.3571 13.5876C20.0811 15.0081 19.2591 16.2055 18.1354 16.9812C18.1592 16.8888 18.1824 16.7956 18.2008 16.7009L18.8678 13.2614C19.7666 8.6246 16.214 4.31808 11.4908 4.31808H7.86389C8.78193 3.59964 9.93427 3.17745 11.1705 3.17745H21.8073Z" fill="#b9f641"></path>
    <path d="M2.34949 10.1378C2.83362 7.64057 5.02029 5.83711 7.56405 5.83711L11.4747 5.83711C15.228 5.83711 18.0504 9.25926 17.336 12.9439L16.6057 16.7114C16.1797 18.9088 14.2555 20.4958 12.0171 20.4958L0.908139 20.4958C0.614317 20.4958 0.393367 20.2279 0.449288 19.9394L2.34949 10.1378Z" fill="#b9f641"></path>
    <path d="M28.8147 19.058L31.8938 3.52325H39.3275C40.999 3.52325 42.2747 3.82463 43.1544 4.4274C44.0488 5.03017 44.496 5.90493 44.496 7.05166C44.496 8.02198 44.2394 8.83792 43.7262 9.4995C43.2277 10.1611 42.5606 10.6609 41.7248 10.9991C40.8891 11.3372 39.98 11.5063 38.9976 11.5063L39.5695 10.6242C40.8597 10.6242 41.8861 10.9256 42.6485 11.5283C43.4256 12.1164 43.8142 12.9691 43.8142 14.0864C43.8142 15.1744 43.5136 16.0859 42.9125 16.821C42.326 17.5414 41.5122 18.1759 40.4712 18.5288C39.4302 18.8816 38.2352 19.058 36.8863 19.058H28.8147ZM32.9055 16.2697H37.1062C38.0886 16.2697 38.8583 16.0859 39.4155 15.7183C39.9873 15.3361 40.2733 14.7774 40.2733 14.0423C40.2733 13.469 40.0607 13.0647 39.6354 12.8294C39.2249 12.5795 38.6677 12.4546 37.9639 12.4546H33.2574L33.7852 9.85235H37.788C38.4038 9.85235 38.9317 9.77149 39.3715 9.60977C39.8261 9.44805 40.1706 9.20547 40.4052 8.88203C40.6398 8.54389 40.7571 8.13959 40.7571 7.66914C40.7571 7.15458 40.5592 6.78703 40.1633 6.56651C39.7674 6.33128 39.2102 6.21367 38.4918 6.21367H34.8849L32.9055 16.2697Z" fill="currentColor"></path>
    <path d="M44.4127 19.0446L46.7858 7.09577H50.1948L47.8217 19.0446H44.4127ZM49.0732 5.44182C48.472 5.44182 47.9881 5.27275 47.6216 4.93461C47.255 4.58177 47.0718 4.15542 47.0718 3.65556C47.0718 3.06749 47.277 2.58233 47.6876 2.20009C48.1128 1.80314 48.6626 1.60467 49.3371 1.60467C49.9382 1.60467 50.4221 1.77374 50.7886 2.11188C51.1699 2.43532 51.3605 2.83961 51.3605 3.32477C51.3605 3.95695 51.1479 4.47151 50.7227 4.86845C50.3121 5.2507 49.7623 5.44182 49.0732 5.44182Z" fill="currentColor"></path>
    <path d="M54.8648 19.0446C54.0144 19.0446 53.2886 18.8755 52.6875 18.5374C52.0863 18.1845 51.6538 17.6847 51.3898 17.0378C51.1406 16.3762 51.1039 15.597 51.2799 14.7002L53.3239 4.47151H56.7548L54.7108 14.6782C54.6229 15.178 54.6742 15.575 54.8648 15.869C55.0554 16.163 55.4073 16.3101 55.9205 16.3101C56.1551 16.3101 56.3897 16.2733 56.6243 16.1998C56.8735 16.1263 57.1008 16.0234 57.3061 15.8911L57.8119 18.3389C57.3867 18.6035 56.9175 18.7873 56.4043 18.8902C55.8912 18.9931 55.378 19.0446 54.8648 19.0446ZM52.2235 10.0067L52.7513 7.3604H59.1301L58.6023 10.0067H52.2235Z" fill="currentColor"></path>
    <path d="M63.6885 19.0054C62.7208 19.0054 61.885 18.7995 61.1813 18.3879C60.4775 17.9615 59.979 17.3441 59.6857 16.5355C59.3925 15.7269 59.3582 14.8583 59.5928 13.6674L60.8904 7.09577H64.3214L63.0678 13.4469C62.8918 14.3143 62.9578 14.9833 63.2657 15.4537C63.5883 15.9242 64.1528 16.1594 64.9592 16.1594C65.8096 16.1594 66.5207 15.9095 67.0925 15.4096C67.679 14.9097 68.0676 14.1453 68.2582 13.1161L69.4678 7.09577H72.8988L70.5185 19.0054H67.2634L67.9503 15.6081L68.4341 16.6225C67.877 17.4899 67.1855 17.9983 66.3497 18.4099C65.514 18.8069 64.6269 19.0054 63.6885 19.0054Z" fill="currentColor"></path>
    <path d="M81.9819 6.91935C82.9936 6.91935 83.8513 7.13252 84.5551 7.55887C85.2589 7.97052 85.7574 8.58064 86.0506 9.38924C86.3439 10.1978 86.3732 11.1976 86.1386 12.3884L84.7982 19.0054H81.3673L82.6637 12.6089C82.8396 11.7415 82.7663 11.0726 82.4437 10.6021C82.1358 10.1317 81.564 9.89645 80.7282 9.89645C79.8632 9.89645 79.1374 10.1464 78.5509 10.6462C77.9791 11.1461 77.5832 11.9106 77.3632 12.9397L76.1548 19.0054H72.7238L75.0979 7.09577H78.353L77.6712 10.4478L77.1873 9.43335C77.7591 8.56594 78.4629 7.93377 79.2987 7.53682C80.1491 7.12517 81.0435 6.91935 81.9819 6.91935Z" fill="currentColor"></path>
    <path d="M86.95 19.0054L89.3249 7.09577H92.7338L90.359 19.0054H86.95ZM91.6122 5.44182C91.011 5.44182 90.5272 5.27275 90.1606 4.93461C89.7941 4.58177 89.6108 4.15542 89.6108 3.65556C89.6108 3.06749 89.8161 2.58233 90.2266 2.20009C90.6518 1.80314 91.2016 1.60467 91.8761 1.60467C92.4773 1.60467 92.9611 1.77374 93.3277 2.11188C93.7089 2.43532 93.8995 2.83961 93.8995 3.32477C93.8995 3.95695 93.6869 4.47151 93.2617 4.86845C92.8511 5.2507 92.3013 5.44182 91.6122 5.44182Z" fill="currentColor"></path>
    <path d="M90.359 19.0054L95.8876 12.9019L96.3526 12.9231L96.2056 13.168L95.8876 12.9019L92.7338 7.09577H96.2714L98.7346 11.6607L97.1511 11.6386L101.44 7.09577H105.223L98.7126 13.888L98.9986 12.0576L102.822 19.0054H99.1929L96.6673 14.2408H98.2728L94.2738 19.0054H90.359Z" fill="currentColor"></path>
  </svg>
);

const Button: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}> = ({ children, className = "", onClick, href, variant = 'primary', fullWidth = false }) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 text-center";
  const variants = {
    primary: "bg-[#b9f641] text-black hover:bg-[#a6de3a] pulse-glow",
    outline: "border-2 border-[#b9f641] text-[#b9f641] hover:bg-[#b9f641] hover:text-black",
    ghost: "text-white hover:bg-white/10"
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
};

const Section: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = "", id }) => (
  <section id={id} className={`py-16 md:py-24 px-4 max-w-7xl mx-auto w-full opacity-0 translate-y-8 transition-all duration-1000 ease-out animate-fade-in ${className}`}>
    {children}
  </section>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#2a2a2a] py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <h3 className="text-lg font-semibold text-white pr-4">{question}</h3>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-[#b9f641]`} />
      </button>
      <div className={`mt-2 text-gray-400 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="pb-4">{answer}</p>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; footer?: string }> = ({ title, children, icon, footer }) => (
  <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-3xl hover:border-[#b9f641]/50 transition-all duration-300 flex flex-col h-full group">
    <div className="mb-6 bg-[#2a2a2a] w-12 h-12 rounded-xl flex items-center justify-center text-[#b9f641] group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#b9f641] transition-colors">{title}</h3>
    <div className="text-gray-400 mb-6 flex-grow leading-relaxed">
      {children}
    </div>
    {footer && <div className="text-xs text-[#b9f641] font-mono mt-auto">{footer}</div>}
  </div>
);

const Tooltip: React.FC<{ children: React.ReactNode; text: React.ReactNode }> = ({ children, text }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-xs text-gray-300 shadow-2xl z-20 pointer-events-none animate-fade-in">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#2a2a2a]" />
        </div>
      )}
    </div>
  );
};

const BonusCalculator: React.FC = () => {
  const [volume, setVolume] = useState<number>(50000);
  const [deposit, setDeposit] = useState<number>(1000);

  const calculatedBonus = useMemo(() => {
    let total = 20; // Signup base
    
    // Deposit Tiers
    if (deposit >= 100) total += 30;
    if (deposit >= 500) total += 50;
    if (deposit >= 1000) total += 100;
    if (deposit >= 5000) total += 500;

    // Volume Tiers
    if (volume >= 10000) total += 100;
    if (volume >= 50000) total += 400;
    if (volume >= 250000) total += 1500;
    if (volume >= 1000000) total += 5000;

    return Math.min(total, 7700);
  }, [volume, deposit]);

  const percentage = (calculatedBonus / 7700) * 100;

  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-[40px] p-8 md:p-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2 space-y-10">
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calculator className="text-[#b9f641]" /> Estimate Your Rewards
            </h3>
            <p className="text-gray-400 mb-8">Adjust the sliders to see how your trading activity translates into USDT bonuses.</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Trading Volume (Monthly)</label>
                  <Tooltip text={
                    <div className="space-y-2">
                      <p className="font-bold text-[#b9f641] border-b border-[#2a2a2a] pb-1 mb-2">Volume Rewards</p>
                      <div className="flex justify-between"><span>$10,000+</span> <span className="text-white">+100 USDT</span></div>
                      <div className="flex justify-between"><span>$50,000+</span> <span className="text-white">+400 USDT</span></div>
                      <div className="flex justify-between"><span>$250,000+</span> <span className="text-white">+1,500 USDT</span></div>
                      <div className="flex justify-between"><span>$1,000,000+</span> <span className="text-white">+5,000 USDT</span></div>
                    </div>
                  }>
                    <Info className="w-4 h-4 text-gray-500 hover:text-[#b9f641] transition-colors cursor-help" />
                  </Tooltip>
                </div>
                <span className="text-2xl font-black text-[#b9f641]">${volume.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1500000" 
                step="5000"
                value={volume} 
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#b9f641]"
              />
              <div className="flex justify-between text-[10px] text-gray-600 font-bold">
                <span>$0</span>
                <span>$500K</span>
                <span>$1M</span>
                <span>$1.5M+</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Initial Deposit (USDT)</label>
                  <Tooltip text={
                    <div className="space-y-2">
                      <p className="font-bold text-[#b9f641] border-b border-[#2a2a2a] pb-1 mb-2">Deposit Bonuses</p>
                      <div className="flex justify-between"><span>$100+</span> <span className="text-white">+30 USDT</span></div>
                      <div className="flex justify-between"><span>$500+</span> <span className="text-white">+50 USDT</span></div>
                      <div className="flex justify-between"><span>$1,000+</span> <span className="text-white">+100 USDT</span></div>
                      <div className="flex justify-between"><span>$5,000+</span> <span className="text-white">+500 USDT</span></div>
                    </div>
                  }>
                    <Info className="w-4 h-4 text-gray-500 hover:text-[#b9f641] transition-colors cursor-help" />
                  </Tooltip>
                </div>
                <span className="text-2xl font-black text-[#b9f641]">${deposit.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="100"
                value={deposit} 
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#b9f641]"
              />
              <div className="flex justify-between text-[10px] text-gray-600 font-bold">
                <span>$0</span>
                <span>$2.5K</span>
                <span>$5K</span>
                <span>$10K+</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#b9f641]/5 border border-[#b9f641]/20 rounded-2xl flex gap-4 items-start">
            <AlertCircle className="text-[#b9f641] shrink-0 w-5 h-5 mt-0.5" />
            <div className="text-xs text-gray-400 leading-relaxed">
              <span className="text-[#b9f641] font-bold">Note:</span> Bonuses are unlocked in stages. A minimum of $100 deposit and $1,000 trading volume is required to begin the unlocking process. High-volume traders (&gt;$1M) unlock the full 7,700 USDT package.
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col justify-center items-center text-center p-8 bg-black rounded-3xl border border-[#2a2a2a] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,246,65,0.05)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 space-y-6 w-full">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#b9f641]/10 rounded-full mb-4">
              <Coins className="text-[#b9f641] w-10 h-10" />
            </div>
            <h4 className="text-gray-500 font-bold uppercase tracking-widest text-sm">Potential Total Bonus</h4>
            <div className="text-7xl md:text-8xl font-black text-white tracking-tighter">
              {calculatedBonus.toLocaleString()}<span className="text-2xl md:text-4xl text-[#b9f641] ml-2">USDT</span>
            </div>
            
            <div className="w-full max-w-sm mx-auto space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
                <span>Progress to Max</span>
                <span>{percentage.toFixed(0)}%</span>
              </div>
              <div className="h-3 w-full bg-[#1a1a1a] rounded-full overflow-hidden border border-[#2a2a2a]">
                <div 
                  className="h-full bg-gradient-to-r from-[#b9f641]/50 to-[#b9f641] transition-all duration-500 ease-out" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="pt-8">
              <Button href={REGISTER_URL} fullWidth className="max-w-xs mx-auto">Lock In My Bonus Now</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [copied, setCopied] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 400);
      setIsScrolled(window.scrollY > 20);
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('section').forEach(section => observer.observe(section));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(REFERRAL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <a href="#" className="hover:opacity-80 transition-opacity">
            <BitunixLogo className="w-24 md:w-32 h-auto text-white" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#bonuses" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Bonuses</a>
            <a href="#calculator" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Calculator</a>
            <a href="#vip" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">VIP Benefits</a>
            <Button href={REGISTER_URL} className="px-6 py-2.5 text-sm">Register Now</Button>
          </div>
          <div className="md:hidden">
            <Button href={REGISTER_URL} className="px-5 py-2 text-xs">Join Now</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(185,246,65,0.08)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#b9f641]/30 bg-[#b9f641]/5 text-[#b9f641] text-sm font-bold tracking-wider mb-8 animate-bounce">
            🔥 EXCLUSIVE REFERRAL PROMOTION 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[1.1]">
            Unlock Up to <span className="text-[#b9f641]">7,700 USDT</span> <br className="hidden md:block"/>
            + 77.7% Fee Discount
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Use Bitunix Referral Code: <span className="text-white font-bold">{REFERRAL_CODE}</span> — Get Instant <span className="text-white font-bold underline decoration-[#b9f641]">VIP 2 Status</span> for 30 Days.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button href={REGISTER_URL}>
              Claim Your Bonus Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="flex flex-col items-center">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-[#1a1a1a] px-6 py-4 rounded-full border border-[#2a2a2a] group"
              >
                <span>Code: <span className="text-[#b9f641] font-mono">{REFERRAL_CODE}</span></span>
                {copied ? <CheckCircle className="w-4 h-4 text-[#b9f641]" /> : <Copy className="w-4 h-4 group-hover:scale-110" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 items-center justify-center">
            {[
              { label: "3M+ Global Users", icon: <Globe className="w-4 h-4"/> },
              { label: "1,000+ Trading Pairs", icon: <LayoutGrid className="w-4 h-4"/> },
              { label: "$5B+ Daily Volume", icon: <TrendingUp className="w-4 h-4"/> },
              { label: "BBB Security Rating", icon: <ShieldCheck className="w-4 h-4"/> },
              { label: "No. 7 Global Exchange", icon: <Trophy className="w-4 h-4"/> }
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="text-[#b9f641]/50">{badge.icon}</div>
                <span className="text-xs md:text-sm font-medium text-gray-500 whitespace-nowrap">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Breakdown Section */}
      <Section id="bonuses">
        <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Your Exclusive <span className="text-[#b9f641]">Welcome Package</span></h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Up to 7,700 USDT Bonus" icon={<Gift />} footer="Use within 90 days">
            Sign-up bonus + deposit rewards + trading rewards combined. Bonus credits are subject to trading volume requirements.
          </Card>
          <Card title="77.7% Trading Fee Discount" icon={<Zap />} footer="Applied automatically">
            Massive savings on every trade. Compare: Standard VIP 0 fee is 0.02%/0.06% — you start much lower.
          </Card>
          <Card title="Instant VIP 2 for 30 Days" icon={<UserCheck />} footer="Upgrade with $375 deposit">
            Skip the grind. VIP 2 benefits include lower fees and Weekly Mystery Box rewards (prizes up to 10,000 USDT).
          </Card>
          <Card title="Level Up to VIP 3" icon={<TrendingUp />} footer="VIP Earn Products">
            Deposit $375 to unlock VIP 3. Includes Guaranteed Stop-Loss Coupon and even larger Mystery Box prizes.
          </Card>
        </div>
      </Section>

      {/* Calculator Section */}
      <Section id="calculator" className="bg-[#050505]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Calculate Your <span className="text-[#b9f641]">Potential Rewards</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">See how much of the 7,700 USDT referral prize pool you can personally claim based on your trading volume and deposits.</p>
        </div>
        <BonusCalculator />
      </Section>

      {/* How to Claim Section */}
      <Section className="bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Get Started in <span className="text-[#b9f641]">3 Minutes</span></h2>
          <div className="space-y-12">
            {[
              { title: "Click the Sign-Up Button", desc: "Visit bitunix.com through our exclusive link below." },
              { title: "Enter Referral Code: BITUNIXBONUS", desc: "Make sure to enter the code during registration — cannot be added later!" },
              { title: "Complete KYC & Deposit $100+", desc: "Quick verification unlocks all bonus rewards immediately." },
              { title: "Start Trading Volume", desc: "Hit $1,000 trading volume in 60 days to fully unlock bonus credits." },
              { title: "Deposit $375 for VIP 3", desc: "Optional upgrade to unlock Guaranteed Stop-Loss and higher rewards." }
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#b9f641] text-black flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(185,246,65,0.4)]">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#b9f641] transition-colors">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button href={REGISTER_URL} className="w-full md:w-auto px-12">Claim My 7,700 USDT Bonus</Button>
          </div>
        </div>
      </Section>

      {/* Comparison Table Section */}
      <Section id="vip">
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-center">Why VIP Matters</h2>
        <p className="text-center text-gray-400 mb-16">Your trading edge starts from day one.</p>
        
        <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="py-6 px-4 text-gray-500 font-bold uppercase tracking-wider text-xs">Feature</th>
                <th className="py-6 px-4 text-gray-500 font-bold uppercase tracking-wider text-xs">Standard (VIP 0)</th>
                <th className="py-6 px-4 text-[#b9f641] font-bold uppercase tracking-wider text-xs">Your Deal (VIP 2)</th>
                <th className="py-6 px-4 text-gray-500 font-bold uppercase tracking-wider text-xs">VIP 3 (Upgrade)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Spot Fee (M/T)", v0: "0.0800% / 0.1000%", v2: "0.0600% / 0.0800%", v3: "0.0350% / 0.0600%" },
                { label: "Futures Fee (M/T)", v0: "0.0200% / 0.0600%", v2: "0.0160% / 0.0500%", v3: "0.0140% / 0.0400%" },
                { label: "Mystery Box", v0: "❌ None", v2: "✅ Up to 200 USDT", v3: "✅ Up to 500 USDT" },
                { label: "Guaranteed SL", v0: "❌", v2: "❌", v3: "✅" },
                { label: "VIP Earn", v0: "❌", v2: "❌", v3: "✅" },
                { label: "Fee Discount", v0: "Standard", v2: "77.7% OFF", v3: "87% OFF" }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-[#2a2a2a] hover:bg-white/5 transition-colors">
                  <td className="py-6 px-4 font-semibold text-white">{row.label}</td>
                  <td className="py-6 px-4 text-gray-400">{row.v0}</td>
                  <td className="py-6 px-4 font-bold text-[#b9f641] bg-[#b9f641]/5 border-x border-[#b9f641]/20">{row.v2}</td>
                  <td className="py-6 px-4 text-gray-400">{row.v3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* External VIP Level Up */}
      <Section className="bg-gradient-to-b from-black to-[#050505]">
        <div className="bg-[#1a1a1a] border-2 border-[#b9f641]/20 rounded-[40px] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#b9f641]/10 blur-[100px] pointer-events-none" />
          
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">Already a VIP on another Exchange?</h2>
            <p className="text-xl text-[#b9f641] font-bold mb-8 italic">Get VIP+1 on Bitunix — Instantly</p>
            
            <ul className="space-y-4 mb-12 text-gray-300">
              <li className="flex items-center gap-3"><CheckCircle className="text-[#b9f641] w-5 h-5" /> Enjoy up to 87% Fee Discount instantly</li>
              <li className="flex items-center gap-3"><CheckCircle className="text-[#b9f641] w-5 h-5" /> Receive Exclusive Mystery Boxes Weekly</li>
              <li className="flex items-center gap-3"><CheckCircle className="text-[#b9f641] w-5 h-5" /> Dedicated VIP Customer Manager</li>
              <li className="flex items-center gap-3"><CheckCircle className="text-[#b9f641] w-5 h-5" /> VIP-Only Events & Private Wealth Plans</li>
            </ul>

            <div className="flex flex-wrap gap-4 items-center mb-12 opacity-50">
              {['Binance', 'OKX', 'Bybit', 'Bitget', 'KuCoin', 'Gate.io', 'HTX'].map(ex => (
                <span key={ex} className="px-3 py-1 border border-white/20 rounded-lg text-sm">{ex}</span>
              ))}
            </div>

            <Button href={VIP_PLAN_URL} variant="primary">Apply for VIP Level Up <ArrowRight className="ml-2 w-5 h-5" /></Button>
          </div>
        </div>
      </Section>

      {/* Why Bitunix Section */}
      <Section id="trust">
        <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Why <span className="text-[#b9f641]">3 Million Traders</span> Choose Bitunix</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Award-Winning", desc: "Best Emerging Exchange 2025 & Breakthrough Platform of the Year.", icon: <Trophy /> },
            { title: "Institutional Security", desc: "Fireblocks + Elliptic integration, $42M insurance coverage.", icon: <ShieldCheck /> },
            { title: "$30M Care Fund", desc: "30 million USDC reserve fund dedicated purely to user protection.", icon: <Zap /> },
            { title: "Proof of Reserves", desc: "Transparent, verifiable on-chain proof that user funds are 1:1 backed.", icon: <LayoutGrid /> },
            { title: "Ultra-Fast Execution", desc: "Millisecond matching, $5B+ daily volume with zero lag.", icon: <Zap /> },
            { title: "Licensed & Regulated", desc: "US MSB, Canada MSB, and Philippines VASP compliant.", icon: <Globe /> },
            { title: "Zero Breaches", desc: "Flawless security record since launch. Your funds are SAFU.", icon: <ShieldCheck /> },
            { title: "4th Anniversary", desc: "$4M USDT prize pool featuring Tesla cars and trading bonuses.", icon: <Gift /> }
          ].map((item, idx) => (
            <div key={idx} className="group">
              <div className="text-[#b9f641] mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Anniversary Section */}
      <section className="py-20 bg-[#b9f641] text-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">🎉 Bitunix 4th Anniversary <br/> $4M USDT Giveaway</h2>
            <p className="text-xl font-bold mb-8">Join Ultra 4ward and Win Tesla, Gold, and Massive USDT Rewards.</p>
            <ul className="space-y-3 mb-12 font-medium">
              <li className="flex items-center gap-2">• Lucky Draw, Solo Contest, and Team Contest</li>
              <li className="flex items-center gap-2">• Win real Tesla vehicles and physical gold</li>
              <li className="flex items-center gap-2">• Simple tasks: trade, deposit, share, invite</li>
            </ul>
            <Button href={ANNIVERSARY_URL} className="bg-black text-white border-none px-12">Join Event Now</Button>
          </div>
          <div className="md:w-1/2 bg-black/10 rounded-[40px] p-8 md:p-12">
            <div className="text-center">
              <div className="text-7xl font-black mb-2 tracking-tighter">No. 7</div>
              <p className="text-lg font-bold opacity-80 mb-8">Global Derivatives Exchange (CoinGlass 2025)</p>
              <div className="flex gap-4 items-center justify-center">
                <div className="w-1/2 bg-black/20 p-4 rounded-2xl">
                  <div className="text-2xl font-bold">$5B+</div>
                  <div className="text-xs uppercase opacity-60">24h Volume</div>
                </div>
                <div className="w-1/2 bg-black/20 p-4 rounded-2xl">
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-xs uppercase opacity-60">Pairs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Section id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Frequently Asked <span className="text-[#b9f641]">Questions</span></h2>
          <div className="space-y-4">
            <FAQItem 
              question="What is the Bitunix referral code?" 
              answer={`The referral code is ${REFERRAL_CODE}. Enter it during registration to unlock up to 7,700 USDT in bonuses and 77.7% fee discount.`} 
            />
            <FAQItem 
              question="What is the minimum deposit?" 
              answer="The minimum initial deposit is $100 to activate your bonus rewards package." 
            />
            <FAQItem 
              question="How do I upgrade from VIP 2 to VIP 3?" 
              answer="Deposit $375 during your 30-day VIP 2 trial period to automatically upgrade to VIP 3 with additional benefits like Guaranteed Stop-Loss." 
            />
            <FAQItem 
              question="Can I apply the referral code after registration?" 
              answer={`No, the referral code ${REFERRAL_CODE} must be entered during the registration process. It cannot be added later.`} 
            />
            <FAQItem 
              question="I'm already VIP on another exchange. Can I get a higher level?" 
              answer="Yes! Upload proof of your VIP status or 30-day trading volume from another exchange. Bitunix will match and upgrade you to VIP+1." 
            />
            <FAQItem 
              question="Is Bitunix safe?" 
              answer="Bitunix has institutional-grade security (Fireblocks + Elliptic), $42M insurance coverage, a $30M USDC Care Fund, Proof of Reserves, and zero history of security breaches." 
            />
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-t from-[#b9f641]/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8">Don't Miss Out — Start Trading with VIP Privileges Today</h2>
          <div className="mb-12">
            <Button href={REGISTER_URL} className="px-16 text-2xl h-20">Sign Up with Code {REFERRAL_CODE} <ArrowRight className="ml-3 w-8 h-8" /></Button>
          </div>
          <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl group cursor-pointer" onClick={copyToClipboard}>
            <span className="text-gray-400">Referral Code:</span>
            <span className="text-2xl font-black text-[#b9f641] font-mono">{REFERRAL_CODE}</span>
            <Copy className={`w-6 h-6 transition-colors ${copied ? 'text-[#b9f641]' : 'text-white/50 group-hover:text-white'}`} />
          </div>
          {copied && <div className="mt-4 text-[#b9f641] font-bold animate-pulse">Copied to clipboard!</div>}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-black border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <BitunixLogo className="w-32 h-auto text-white" />
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-[#b9f641]">Privacy Policy</a>
              <a href="#" className="hover:text-[#b9f641]">Terms of Service</a>
              <a href="#" className="hover:text-[#b9f641]">Help Center</a>
            </div>
          </div>
          <div className="border-t border-[#1a1a1a] pt-12 text-gray-500 text-xs md:text-sm leading-relaxed">
            <p className="mb-6">
              Disclaimer: Trading digital assets involves significant risk and can result in the loss of your invested capital. 
              The value of cryptocurrency is highly volatile and not suitable for every investor. Always do your own research 
              before making any financial decisions. Bonus credits are subject to trading volume requirements and full platform 
              Terms & Conditions.
            </p>
            <p>© 2026 Bitunix. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm transition-all duration-500 md:hidden ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <Button href={REGISTER_URL} fullWidth className="shadow-[0_10px_40px_rgba(185,246,65,0.4)]">
          Sign Up Now
        </Button>
      </div>
    </div>
  );
}
