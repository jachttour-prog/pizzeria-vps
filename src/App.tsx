import { useState, useEffect, useRef } from "react";

interface MenuItem {
  name: string;
  ingredients?: string;
  prices: Record<string, string>;
  bestseller?: boolean;
  isNew?: boolean;
}
interface MenuCategory { name: string; items: MenuItem[]; }
interface MenuData {
  categories: MenuCategory[];
  extras: { pizza_additions: { name: string; prices: Record<string, string> }[]; sauces: string[]; sauce_price: string; };
}

const RESTAURANK_URL = "https://restaurank.pl/miasto/wegorzewo/restauracja/pizzeria-peperoni";
const CATEGORY_ICONS: Record<string, string> = { "Pizza":"🍕","Burgery":"🍔","Sałatki":"🥗","Makarony z pieca":"🍝","Zapiekanki z pieca":"🥘","Makarony":"🍝","Przekąski":"🥨","Kubki":"🍟","Napoje":"🥤" };
const AWARDS = [
  { id:1, title:"Wsparcie Żołnierzy", description:"Certyfikat uznania za wsparcie Batalionu 16. Anakondy", year:"2016" },
  { id:2, title:"Festiwal Kultury Łowieckiej", description:"Dyplom uczestnictwa w V Festiwalu Kultury Łowieckiej", year:"2010" },
  { id:3, title:"Zadowolony Konsument", description:"Certyfikat jako firma promująca najwyższą jakość", year:"2016" },
  { id:4, title:"Wspieramy edukację", description:"Podziękowania od Poradni Psychologiczno-Pedagogicznej", year:"2009" },
  { id:5, title:"Sponsor Półmaratonu Węgorza", description:"Podziękowanie za XI Półmaraton Węgorza i XIX Biegi Dziecięce", year:"2015" },
  { id:6, title:"IX Półmaraton Węgorza", description:"Uznanie za życzliwość i bezinteresowną pomoc", year:"2013" },
  { id:7, title:"Wsparcie dzieci", description:"Podziękowanie od Przedszkola Tygrysek", year:"2017" },
];
const TOPPINGS = {
  vegetables: ["pieczarki","papryka","cebula","oliwki","kukurydza","pomidor","rukola","jalapeño","ananas"],
  meats: ["salami","szynka","boczek","kurczak","kebab"],
  cheeses: ["ser feta","parmezan","camembert"],
};

export default function App() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [activeCategory, setActiveCategory] = useState("Pizza");
  const [isLoaded, setIsLoaded] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [awardsVisible, setAwardsVisible] = useState(false);
  const awardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`./menu.json?v=${Date.now()}`).then(r=>r.json()).then((d:MenuData)=>{ setMenuData(d); if(d.categories.length>0) setActiveCategory(d.categories[0].name); }).catch(console.error);
    setTimeout(()=>setIsLoaded(true),100);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(e=>{ if(e[0].isIntersecting) setAwardsVisible(true); },{threshold:0.1});
    if(awardsRef.current) obs.observe(awardsRef.current);
    return ()=>obs.disconnect();
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  const activeItems = menuData?.categories.find(c=>c.name===activeCategory)?.items ?? [];

  const S = {
    orange: "#E85D04", orangeDark: "#C44D00", burgundy: "#7B2D2D",
    cream: "#FDF6EC", creamDark: "#F5EFE7", text: "#1A1209",
    gold: "#C9A84C", green: "#2D6A4F"
  };

  return (
    <div style={{minHeight:"100vh",backgroundColor:S.cream,fontFamily:"'Lato',sans-serif"}}>

      {/* Banner */}
      {bannerVisible && (
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:60,background:`linear-gradient(90deg,${S.burgundy},${S.orange},${S.burgundy})`,color:"white",padding:"10px 16px"}}>
          <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",gap:12}}>
            <span style={{fontSize:14,fontWeight:700,textAlign:"center"}}>🔥 DZISIAJ: Pizza XL + napój GRATIS przy zamówieniu! Zadzwoń: <a href="tel:874271022" style={{color:"white",textDecoration:"underline"}}>87 427 10 22</a></span>
            <button onClick={()=>setBannerVisible(false)} style={{position:"absolute",right:0,background:"none",border:"none",color:"white",cursor:"pointer",fontSize:22,padding:"2px 8px"}}>×</button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{position:"fixed",left:0,right:0,zIndex:50,top:bannerVisible?40:0,backgroundColor:"rgba(253,246,236,0.97)",backdropFilter:"blur(8px)",borderBottom:"1px solid rgba(26,18,9,0.08)",transition:"top 0.3s"}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <button onClick={()=>scrollTo("hero")} style={{fontSize:22,fontWeight:700,color:S.burgundy,background:"none",border:"none",cursor:"pointer",fontFamily:"'Playfair Display',serif"}}>Pizzeria Peperoni</button>
          <div style={{display:"flex",gap:24,alignItems:"center"}}>
            {[["Opinie","opinie"],["Menu","menu"],["Stwórz Pizzę","stworz-pizze"],["Kontakt","kontakt"]].map(([l,id])=>(
              <button key={id} onClick={()=>scrollTo(id)} style={{background:"none",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(26,18,9,0.65)"}}>{l}</button>
            ))}
          </div>
          <a href="tel:874271022" style={{display:"flex",alignItems:"center",gap:8,backgroundColor:S.orange,color:"white",padding:"10px 20px",borderRadius:999,fontWeight:700,fontSize:15,textDecoration:"none"}}>📞 87 427 10 22</a>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",paddingTop:bannerVisible?120:80,backgroundColor:"#1A1209"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"url('./hero-pizza.png')",backgroundSize:"cover",backgroundPosition:"center",opacity:0.45}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(26,18,9,0.55),rgba(26,18,9,0.4),rgba(26,18,9,0.7))"}} />
        <div style={{position:"relative",zIndex:10,textAlign:"center",padding:"0 24px",maxWidth:900,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,backgroundColor:"rgba(232,93,4,0.9)",borderRadius:999,padding:"10px 20px",marginBottom:24,opacity:isLoaded?1:0,transform:isLoaded?"translateY(0)":"translateY(-16px)",transition:"all 0.6s ease"}}>
            <span>🏆</span><span style={{color:"white",fontWeight:700,fontSize:14}}>Najpopularniejsza Pizzeria Węgorzewa 2025</span>
          </div>
          <h1 style={{fontSize:"clamp(56px,10vw,100px)",fontWeight:900,color:"white",margin:0,lineHeight:1.05,fontFamily:"'Playfair Display',serif",opacity:isLoaded?1:0,transform:isLoaded?"translateY(0)":"translateY(24px)",transition:"all 0.7s ease 0.1s"}}>Pizzeria</h1>
          <h1 style={{fontSize:"clamp(56px,10vw,100px)",fontWeight:900,color:S.orange,marginBottom:24,lineHeight:1.05,fontFamily:"'Playfair Display',serif",opacity:isLoaded?1:0,transform:isLoaded?"translateY(0)":"translateY(24px)",transition:"all 0.7s ease 0.2s"}}>Peperoni</h1>
          <p style={{fontSize:"clamp(16px,2.5vw,22px)",color:"rgba(255,255,255,0.85)",marginBottom:40,opacity:isLoaded?1:0,transition:"all 0.7s ease 0.3s"}}>Autentyczna włoska pizza • Najlepsze składniki • Od ponad 10 lat</p>
          <div style={{opacity:isLoaded?1:0,transition:"all 0.7s ease 0.4s"}}>
            <a href="tel:874271022" className="animate-pulse-glow" style={{display:"inline-flex",alignItems:"center",gap:16,backgroundColor:S.orange,color:"white",fontSize:"clamp(18px,3vw,28px)",fontWeight:900,padding:"18px 40px",borderRadius:16,textDecoration:"none"}}>🔥 ZAMÓW TERAZ - 87 427 10 22</a>
          </div>
          <div style={{marginTop:32,display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",opacity:isLoaded?1:0,transition:"opacity 0.7s ease 0.5s"}}>
            {["🚚 Darmowa dostawa od 25 zł","⏱️ Gotowe w 30 minut"].map(i=>(
              <span key={i} style={{backgroundColor:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.9)",padding:"8px 16px",borderRadius:999,fontSize:14,fontWeight:600}}>{i}</span>
            ))}
          </div>
          <div style={{marginTop:40,color:"rgba(255,255,255,0.6)",fontSize:14}}>
            <p style={{fontWeight:700,marginBottom:4}}>Godziny otwarcia:</p>
            <p>Pon-Czw: 12:00-21:00 • Pią-Sob: 11:00-23:00 • Ndz: 12:00-21:00</p>
          </div>
        </div>
        <button onClick={()=>scrollTo("opinie")} style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:28}}>↓</button>
      </section>

      {/* Social Proof */}
      <section id="opinie" style={{padding:"80px 24px",backgroundColor:"white"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
          {[
            {icon:"⭐",value:"4.3/5.0",label:"236 opinii na Restaurank.pl",sub:null,link:RESTAURANK_URL,color:S.orange,border:"rgba(232,93,4,0.2)"},
            {icon:"🏆",value:"Najpopularniejsza",label:"Pizzeria Węgorzewa 2025",sub:"Nagroda Restaurank.pl",color:S.burgundy,border:"rgba(123,45,45,0.2)"},
            {icon:"👥",value:"2000+",label:"Zadowolonych klientów",sub:"i wciąż rosnąca liczba!",color:S.green,border:"rgba(45,106,79,0.2)"},
          ].map(c=>(
            <div key={c.label} style={{backgroundColor:S.cream,border:`2px solid ${c.border}`,borderRadius:20,padding:"36px 28px",textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:12}}>{c.icon}</div>
              <div style={{fontSize:40,fontWeight:700,color:c.color,marginBottom:8,fontFamily:"'Playfair Display',serif"}}>{c.value}</div>
              <p style={{color:"rgba(26,18,9,0.65)",fontWeight:600,margin:0}}>{c.label}</p>
              {c.sub && <p style={{color:"rgba(26,18,9,0.4)",fontSize:13,margin:"4px 0 0"}}>{c.sub}</p>}
              {c.link && <a href={c.link} target="_blank" rel="noopener noreferrer" style={{color:S.burgundy,fontWeight:700,fontSize:14,marginTop:12,display:"inline-block"}}>Zobacz opinie →</a>}
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section ref={awardsRef} style={{padding:"80px 24px",backgroundColor:S.creamDark}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <span style={{fontSize:48,display:"block",marginBottom:12}}>🏆</span>
            <h2 style={{fontSize:"clamp(32px,5vw,52px)",fontWeight:900,color:S.text,marginBottom:8,fontFamily:"'Playfair Display',serif"}}>Nagrody i Uznania</h2>
            <p style={{color:"rgba(26,18,9,0.6)",fontSize:16}}>Zaufali Nam: Instytucje, Wydarzenia, Społeczność</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:20,marginBottom:48}}>
            {[{value:"15+",label:"Lat Doświadczenia",color:S.gold,border:"rgba(201,168,76,0.3)",delay:0},{value:"7+",label:"Nagród i Podziękowań",color:S.burgundy,border:"rgba(123,45,45,0.3)",delay:150},{value:"2000+",label:"Obsłużonych Eventów",color:S.orange,border:"rgba(232,93,4,0.3)",delay:300}].map(s=>(
              <div key={s.label} style={{backgroundColor:"white",border:`2px solid ${s.border}`,borderRadius:20,padding:"32px 20px",textAlign:"center",opacity:awardsVisible?1:0,transform:awardsVisible?"translateY(0)":"translateY(24px)",transition:`all 0.6s ease ${s.delay}ms`}}>
                <div style={{fontSize:48,fontWeight:700,color:s.color,marginBottom:8,fontFamily:"'Playfair Display',serif"}}>{s.value}</div>
                <p style={{color:"rgba(26,18,9,0.6)",fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.08em",margin:0}}>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20,marginBottom:48}}>
            {AWARDS.map((a,i)=>(
              <div key={a.id} style={{backgroundColor:"white",border:"2px solid rgba(201,168,76,0.2)",borderRadius:20,padding:28,opacity:awardsVisible?1:0,transform:awardsVisible?"translateY(0)":"translateY(24px)",transition:`all 0.6s ease ${450+i*80}ms`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <h3 style={{fontSize:18,fontWeight:700,color:S.text,margin:0,fontFamily:"'Playfair Display',serif"}}>{a.title}</h3>
                  <span style={{backgroundColor:S.gold,color:"white",fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:999,marginLeft:8,flexShrink:0}}>{a.year}</span>
                </div>
                <p style={{color:"rgba(26,18,9,0.6)",fontSize:14,margin:0,lineHeight:1.5}}>{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Award 2025 */}
      <section style={{padding:"80px 24px",background:`linear-gradient(to bottom,white,rgba(123,45,45,0.04),white)`}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:60,alignItems:"center"}}>
          <div style={{borderRadius:24,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
            <img src="./nagroda.png" alt="Najpopularniejsza Pizzeria Węgorzewa 2025" style={{width:"100%",maxWidth:380,display:"block",margin:"0 auto"}} />
          </div>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,backgroundColor:S.burgundy,color:"white",padding:"8px 18px",borderRadius:999,marginBottom:20}}>
              <span>🏆</span><span style={{fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Nagroda 2025</span>
            </div>
            <h2 style={{fontSize:"clamp(32px,4vw,48px)",fontWeight:900,color:S.text,marginBottom:16,lineHeight:1.2,fontFamily:"'Playfair Display',serif"}}>Najpopularniejsza<br /><span style={{color:S.burgundy}}>Pizzeria Węgorzewa</span></h2>
            <p style={{color:"rgba(26,18,9,0.65)",fontSize:16,lineHeight:1.7,marginBottom:24}}>Za wyjątkową popularność wśród gości oraz zaufanie lokalnej społeczności. Restauracja, która zyskała serca mieszkańców i turystów Węgorzewa.</p>
            <a href={RESTAURANK_URL} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:10,backgroundColor:S.burgundy,color:"white",fontWeight:700,padding:"14px 28px",borderRadius:12,textDecoration:"none",fontSize:15}}>Zobacz nasz profil na Restaurank.pl →</a>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" style={{padding:"80px 24px",backgroundColor:S.creamDark}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <span style={{backgroundColor:"rgba(232,93,4,0.1)",color:S.orange,padding:"6px 16px",borderRadius:999,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Nasza oferta</span>
            <h2 style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:900,marginTop:12,color:S.text,fontFamily:"'Playfair Display',serif"}}>Menu</h2>
          </div>

          {activeCategory==="Burgery" && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:32}}>
              {["./burger-1.jpg","./burger-2.jpg","./burger-3.jpg"].map((src,i)=>(
                <div key={i} style={{borderRadius:16,overflow:"hidden",aspectRatio:"4/3"}}><img src={src} alt={`Burger ${i+1}`} style={{width:"100%",height:"100%",objectFit:"cover"}} /></div>
              ))}
            </div>
          )}
          {activeCategory==="Napoje" && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12,marginBottom:32}}>
              {["./drink-1.jpg","./drink-2.jpg","./drink-3.jpg","./drink-4.jpg","./drink-7.jpg","./karta-drink-2.jpg","./karta-drink-3.jpg"].map((src,i)=>(
                <div key={i} style={{borderRadius:16,overflow:"hidden",aspectRatio:"3/4"}}><img src={src} alt={`Napój ${i+1}`} style={{width:"100%",height:"100%",objectFit:"cover"}} /></div>
              ))}
            </div>
          )}

          {menuData && (
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:40,justifyContent:"center"}}>
              {menuData.categories.map(cat=>(
                <button key={cat.name} onClick={()=>setActiveCategory(cat.name)} style={{padding:"10px 20px",borderRadius:999,fontWeight:700,fontSize:14,cursor:"pointer",border:"2px solid",borderColor:activeCategory===cat.name?S.orange:"rgba(26,18,9,0.12)",backgroundColor:activeCategory===cat.name?S.orange:"white",color:activeCategory===cat.name?"white":S.text,transition:"all 0.2s"}}>
                  {CATEGORY_ICONS[cat.name]||"🍽️"} {cat.name}
                </button>
              ))}
            </div>
          )}

          <div style={{display:"grid",gap:12}}>
            {activeItems.map(item=>(
              <div key={item.name} style={{backgroundColor:"white",border:"1px solid rgba(26,18,9,0.08)",borderRadius:16,padding:"20px 24px",display:"flex",flexWrap:"wrap",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:4}}>
                    <h3 style={{fontSize:20,fontWeight:700,color:S.text,margin:0,fontFamily:"'Playfair Display',serif"}}>{item.name}</h3>
                    {item.bestseller && <span style={{backgroundColor:S.orange,color:"white",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999}}>🔥 BESTSELLER</span>}
                    {item.isNew && <span style={{backgroundColor:S.green,color:"white",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999}}>NOWOŚĆ</span>}
                  </div>
                  {item.ingredients && <p style={{color:"rgba(26,18,9,0.55)",fontSize:14,margin:0}}>{item.ingredients}</p>}
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {Object.entries(item.prices).map(([size,price])=>(
                    <div key={size} style={{backgroundColor:S.cream,border:"1px solid rgba(26,18,9,0.06)",borderRadius:12,padding:"8px 16px",textAlign:"center",minWidth:70}}>
                      <p style={{fontSize:11,color:"rgba(26,18,9,0.45)",textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:700,margin:"0 0 2px"}}>{size}</p>
                      <p style={{fontSize:18,fontWeight:900,color:S.orange,margin:0}}>{price} zł</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {activeCategory==="Pizza" && menuData?.extras && (
            <div style={{marginTop:32,backgroundColor:"white",borderRadius:16,padding:24,border:"1px solid rgba(232,93,4,0.15)"}}>
              <h4 style={{fontWeight:700,marginBottom:12,color:S.text}}>Dodatki do pizzy</h4>
              <div style={{display:"flex",flexWrap:"wrap",gap:16,marginBottom:12}}>
                {menuData.extras.pizza_additions.map(a=>(
                  <div key={a.name} style={{fontSize:14}}><strong>{a.name}:</strong> M +{a.prices.M} zł / L +{a.prices.L} zł / XL +{a.prices.XL} zł</div>
                ))}
              </div>
              <div style={{fontSize:14}}><strong>Sosy ({menuData.extras.sauce_price}):</strong> {menuData.extras.sauces.join(", ")}</div>
            </div>
          )}

          <div style={{marginTop:48,textAlign:"center"}}>
            <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:8,backgroundColor:S.cream,border:"2px solid rgba(232,93,4,0.2)",borderRadius:20,padding:"32px 48px"}}>
              <p style={{fontWeight:600,color:"rgba(26,18,9,0.65)",margin:0}}>Zamówienia wyłącznie telefonicznie</p>
              <a href="tel:874271022" style={{fontSize:40,fontWeight:900,color:S.orange,textDecoration:"none",fontFamily:"'Playfair Display',serif"}}>87 427 10 22</a>
              <p style={{fontSize:13,color:"rgba(26,18,9,0.45)",margin:0}}>Dowóz gratis od 25 zł na terenie Węgorzewa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stwórz Pizzę */}
      <section id="stworz-pizze" style={{padding:"80px 24px",backgroundColor:"white"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <span style={{fontSize:48,display:"block",marginBottom:12}}>🎨</span>
            <h2 style={{fontSize:"clamp(32px,5vw,52px)",fontWeight:900,color:S.text,marginBottom:12,fontFamily:"'Playfair Display',serif"}}>Stwórz Swoją Wymarzoną Pizzę</h2>
            <p style={{color:"rgba(26,18,9,0.6)",fontSize:16,maxWidth:560,margin:"0 auto"}}>Wybierz rozmiar, sos i ulubione składniki. Zadzwoń i powiedz nam co lubisz!</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:24,marginBottom:40}}>
            {[
              {label:"Warzywa",icon:"🥬",price:"+3 zł",items:TOPPINGS.vegetables,color:S.green,border:"rgba(45,106,79,0.2)",bg:"rgba(45,106,79,0.04)"},
              {label:"Mięso",icon:"🥩",price:"+5 zł",items:TOPPINGS.meats,color:S.orange,border:"rgba(232,93,4,0.2)",bg:"rgba(232,93,4,0.04)"},
              {label:"Sery",icon:"🧀",price:"+4 zł",items:TOPPINGS.cheeses,color:S.gold,border:"rgba(201,168,76,0.3)",bg:"rgba(201,168,76,0.06)"},
            ].map(g=>(
              <div key={g.label} style={{backgroundColor:g.bg,border:`2px solid ${g.border}`,borderRadius:20,padding:24}}>
                <h3 style={{fontWeight:700,fontSize:16,color:g.color,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
                  <span>{g.icon}</span>{g.label}<span style={{fontSize:13,fontWeight:400,color:"rgba(26,18,9,0.45)"}}>{g.price}</span>
                </h3>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {g.items.map(t=>(
                    <span key={t} style={{backgroundColor:"white",border:`1px solid ${g.border}`,color:S.text,padding:"6px 14px",borderRadius:999,fontSize:13,fontWeight:500}}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center"}}>
            <a href="tel:874271022" style={{display:"inline-flex",alignItems:"center",gap:12,backgroundColor:S.orange,color:"white",fontSize:18,fontWeight:700,padding:"16px 36px",borderRadius:16,textDecoration:"none"}}>📞 Zadzwoń i zamów swoją pizzę</a>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section style={{padding:"80px 24px",backgroundColor:S.creamDark}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:60,alignItems:"center"}}>
          <div style={{backgroundColor:S.cream,border:`2px solid rgba(232,93,4,0.15)`,borderRadius:24,padding:48,textAlign:"center"}}>
            <div style={{fontSize:80,marginBottom:16}}>🍕</div>
            <div style={{fontSize:48,fontWeight:900,color:S.orange,fontFamily:"'Playfair Display',serif"}}>10+</div>
            <div style={{fontWeight:700,color:"rgba(26,18,9,0.6)",fontSize:14,textTransform:"uppercase",letterSpacing:"0.08em"}}>lat tradycji</div>
          </div>
          <div>
            <span style={{fontSize:48,display:"block",marginBottom:16}}>🍕</span>
            <h2 style={{fontSize:"clamp(32px,4vw,48px)",fontWeight:900,color:S.text,marginBottom:20,fontFamily:"'Playfair Display',serif"}}>Nasza Historia</h2>
            <p style={{color:"rgba(26,18,9,0.65)",fontSize:16,lineHeight:1.7,marginBottom:16}}>Od ponad 10 lat pieczemy najlepsze pizze w Węgorzewie. Nasze ciasto wyrasta przez 24 godziny, a każda pizza jest przygotowywana z pasją i dbałością o szczegóły.</p>
            <p style={{color:"rgba(26,18,9,0.65)",fontSize:16,lineHeight:1.7,margin:0}}>Każdego dnia nasz zespół dba o to, by każda pizza opuszczająca naszą kuchnię była doskonała. To nasza pasja i sposób na dzielenie się smakiem prawdziwej Italii.</p>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section style={{padding:"80px 24px",backgroundColor:"white"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:20}}>
          {[{icon:"✓",title:"10+ lat",sub:"doświadczenia",color:S.orange},{icon:"✓",title:"Świeże składniki",sub:"codziennie",color:S.green},{icon:"✓",title:"Tradycyjne przepisy",sub:"włoskie receptury",color:S.burgundy},{icon:"✓",title:"2000+ klientów",sub:"zadowolonych",color:S.gold}].map(b=>(
            <div key={b.title} style={{backgroundColor:S.cream,borderRadius:20,padding:24,textAlign:"center"}}>
              <div style={{width:56,height:56,backgroundColor:b.color,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:"white",fontSize:22,fontWeight:900}}>{b.icon}</div>
              <h3 style={{fontWeight:700,color:S.text,margin:"0 0 4px"}}>{b.title}</h3>
              <p style={{fontSize:13,color:"rgba(26,18,9,0.5)",margin:0}}>{b.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kontakt */}
      <section id="kontakt" style={{padding:"80px 24px",backgroundColor:S.creamDark}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <h2 style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:900,color:S.text,fontFamily:"'Playfair Display',serif"}}>Kontakt</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
            <div style={{backgroundColor:"white",borderRadius:20,padding:28,textAlign:"center",border:"2px solid rgba(26,18,9,0.06)"}}>
              <div style={{fontSize:40,marginBottom:12}}>📍</div>
              <h3 style={{fontSize:22,marginBottom:8,fontFamily:"'Playfair Display',serif"}}>Adres</h3>
              <p style={{color:"rgba(26,18,9,0.7)",fontWeight:600,lineHeight:1.7,margin:0}}>ul. Zamkowa 10C<br />11-600 Węgorzewo</p>
            </div>
            <div style={{backgroundColor:S.orange,borderRadius:20,padding:28,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>📞</div>
              <h3 style={{fontSize:22,color:"white",marginBottom:8,fontFamily:"'Playfair Display',serif"}}>Telefon</h3>
              <a href="tel:874271022" style={{fontSize:32,fontWeight:900,color:"white",textDecoration:"none",display:"block",marginBottom:8,fontFamily:"'Playfair Display',serif"}}>87 427 10 22</a>
              <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:0}}>Zamówienia i rezerwacje</p>
            </div>
            <div style={{backgroundColor:"white",borderRadius:20,padding:28,textAlign:"center",border:"2px solid rgba(26,18,9,0.06)"}}>
              <div style={{fontSize:40,marginBottom:12}}>🕐</div>
              <h3 style={{fontSize:22,marginBottom:12,fontFamily:"'Playfair Display',serif"}}>Godziny otwarcia</h3>
              <div style={{color:"rgba(26,18,9,0.7)",fontSize:14,lineHeight:2,fontWeight:600}}>
                <p style={{margin:0}}>Pon–Czw: <strong style={{color:S.orange}}>12:00–21:00</strong></p>
                <p style={{margin:0}}>Pią–Sob: <strong style={{color:S.orange}}>11:00–23:00</strong></p>
                <p style={{margin:0}}>Niedziela: <strong style={{color:S.orange}}>12:00–21:00</strong></p>
              </div>
            </div>
            <div style={{backgroundColor:S.burgundy,borderRadius:20,padding:28,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>🏆</div>
              <h3 style={{fontSize:22,color:"white",marginBottom:8,fontFamily:"'Playfair Display',serif"}}>Restaurank.pl</h3>
              <p style={{color:"rgba(255,255,255,0.75)",fontSize:14,marginBottom:16}}>Zarezerwuj stolik i przeczytaj opinie</p>
              <a href={RESTAURANK_URL} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",backgroundColor:"white",color:S.burgundy,fontWeight:700,padding:"10px 24px",borderRadius:12,textDecoration:"none",fontSize:14}}>Sprawdź profil →</a>
            </div>
          </div>
          <div style={{marginTop:32,borderRadius:20,overflow:"hidden",border:"2px solid rgba(26,18,9,0.08)"}}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2363.5!2d21.7418!3d54.2168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTTCsDEzJzAwLjUiTiAyMcKwNDQnMzAuNSJF!5e0!3m2!1spl!2spl!4v1" width="100%" height="300" style={{border:0,display:"block"}} allowFullScreen loading="lazy" title="Mapa" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{backgroundColor:S.text,color:"rgba(255,255,255,0.7)",padding:"40px 24px",textAlign:"center"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <p style={{fontSize:24,color:"white",fontWeight:700,marginBottom:8,fontFamily:"'Playfair Display',serif"}}>Pizzeria Peperoni</p>
          <p style={{marginBottom:4}}>ul. Zamkowa 10C, 11-600 Węgorzewo</p>
          <p style={{marginBottom:16}}>📞 87 427 10 22 • Dowóz gratis od 25 zł</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>© {new Date().getFullYear()} Pizzeria Peperoni. Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
}
