import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Smartphone, 
  Shield, 
  CreditCard, 
  Activity, 
  Bell, 
  Lock, 
  MessageSquare, 
  Database,
  Camera,
  Globe,
  MapPin,
  CheckCircle,
  AlertTriangle,
  History,
  TrendingUp,
  Award,
  Trash2,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  UserCheck,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Sun,
  Moon,
  FileText,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, AdminActivityLog } from '../../types';
import { cn, safeFormatDate, optimizeImage } from '../../lib/utils';
import { SupabaseService, signOut } from '../../lib/supabase';

interface UserProfileTabsProps {
  user: UserProfile;
  onUpdate: (updatedUser: Partial<UserProfile>) => Promise<void>;
  activityLogs: AdminActivityLog[];
}

const ProfileTab = ({ active, icon: Icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
      active ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" : "text-slate-500 hover:bg-slate-50"
    )}
  >
    <Icon size={18} />
    {label}
  </button>
);

export const UserProfileTabs = ({ user, onUpdate, activityLogs }: UserProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>(user);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(formData);
      // Show success notification (handled by parent?)
    } finally {
      setIsSaving(false);
    }
  };

  const renderPersonal = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-100">
            <img 
              src={optimizeImage(user.photourl || `https://ui-avatars.com/api/?name=${user.displayname}`, 400)} 
              alt={user.displayname} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <button className="absolute bottom-1 right-1 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all">
            <Camera size={18} />
          </button>
        </div>
        <div className="flex-1 space-y-4 pt-2">
            <h3 className="text-2xl font-black italic">Informations Personnelles</h3>
            <p className="text-slate-400 text-xs font-medium">Gérez votre identité publique et vos informations de base.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 italic">Nom complet</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="text" 
              value={formData.displayname || ''} 
              onChange={e => setFormData({...formData, displayname: e.target.value})}
              className="w-full bg-slate-50 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="Ex: Kouadio Koffi"
              disabled={user.kyc_status === 'verified'}
            />
          </div>
          {user.kyc_status === 'verified' && (
            <p className="text-[9px] text-emerald-500 font-bold px-2 flex items-center gap-1">
              <CheckCircle size={10} /> Validé par KYC • Non modifiable
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 italic">Nom d'utilisateur (Username)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black">@</span>
            <input 
              type="text" 
              value={formData.username || ''} 
              onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
              className="w-full bg-slate-50 rounded-2xl pl-10 pr-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="username"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 italic">Bio / Description</label>
          <textarea 
            value={formData.bio || ''} 
            onChange={e => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-slate-50 rounded-3xl px-6 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[120px]"
            placeholder="Parlez-nous de vous..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 italic">Photo de couverture</label>
        <div className="w-full aspect-[3/1] rounded-[2rem] bg-slate-100 overflow-hidden relative group border-4 border-white shadow-xl">
          {formData.cover_image ? (
            <img src={formData.cover_image} className="w-full h-full object-cover" alt="Cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
              <ImageIcon size={40} />
              <span className="text-[10px] font-black uppercase tracking-widest">Aucune image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button className="bg-white text-slate-900 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-primary hover:text-white transition-all">
                Changer la couverture
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
          <h3 className="text-2xl font-black italic">Contact & Coordonnées</h3>
          <p className="text-slate-400 text-xs font-medium">Comment les autres membres et l'équipe peuvent vous joindre.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 italic">Email principal</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="email" 
              value={formData.email || ''} 
              disabled
              className="w-full bg-slate-50/50 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-400 cursor-not-allowed"
            />
          </div>
          <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline px-2">Changer d'email principal</button>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 italic">Email de secours</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="email" 
              value={formData.secondary_email || ''} 
              onChange={e => setFormData({...formData, secondary_email: e.target.value})}
              className="w-full bg-slate-50 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="secours@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 italic">Téléphone</label>
          <div className="relative">
            <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="tel" 
              value={formData.phone || ''} 
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-slate-50 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="+225 00 00 00 00 00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 italic">WhatsApp</label>
          <div className="relative">
            <MessageSquare size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
            <input 
              type="tel" 
              value={formData.whatsapp || ''} 
              onChange={e => setFormData({...formData, whatsapp: e.target.value})}
              className="w-full bg-slate-50 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              placeholder="+225..."
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6 pt-4">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <MapPin size={20} className="text-primary" />
            <h4 className="text-sm font-black uppercase tracking-widest">Adresse & Localisation</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 italic">Adresse Postale</label>
              <input 
                type="text" 
                value={formData.address || ''} 
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                placeholder="Rue, Quartier, BP..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 italic">Ville</label>
              <input 
                type="text" 
                value={formData.city || ''} 
                onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                placeholder="Abidjan"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 italic">Pays</label>
              <input 
                type="text" 
                value={formData.country || ''} 
                onChange={e => setFormData({...formData, country: e.target.value})}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                placeholder="Côte d'Ivoire"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 italic">Fuseau Horaire</label>
              <select 
                value={formData.timezone || 'UTC'}
                onChange={e => setFormData({...formData, timezone: e.target.value})}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-[10px] font-bold outline-none"
              >
                <option value="UTC">UTC (GMT)</option>
                <option value="Africa/Abidjan">Africa/Abidjan (+0)</option>
                <option value="Europe/Paris">Europe/Paris (+1)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6 pt-4">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <Globe size={20} className="text-secondary" />
            <h4 className="text-sm font-black uppercase tracking-widest">Liens & Réseaux Sociaux</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 italic">Site Web / Portfolio</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="url" 
                  value={formData.website_url || ''} 
                  onChange={e => setFormData({...formData, website_url: e.target.value})}
                  className="w-full bg-slate-50 rounded-xl pl-9 pr-4 py-3 text-[10px] font-bold outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
            {/* Social inputs... (omitted for brevity but normally here) */}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
          <h3 className="text-2xl font-black italic">Sécurité du Compte</h3>
          <p className="text-slate-400 text-xs font-medium">Protégez votre compte avec des outils de sécurité avancés.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest leading-none">Double Authentification (2FA)</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Niveau de sécurité : MAXIMAL</p>
              </div>
           </div>
           
           <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-600">Statut actuel</span>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                user.is_2fa_enabled ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
              )}>
                {user.is_2fa_enabled ? "Activé" : "Désactivé"}
              </span>
           </div>

           <button 
            className={cn(
               "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
               user.is_2fa_enabled ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-primary text-white hover:bg-slate-900 shadow-xl shadow-primary/20"
            )}
           >
             {user.is_2fa_enabled ? "Désactiver la 2FA" : "Configurer la 2FA"}
           </button>
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest leading-none">Code PIN de Sécurité</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Utilisé pour les transactions sensibles.</p>
              </div>
           </div>
           
           <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-600">Statut du PIN</span>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                user.pin_code_hash ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
              )}>
                {user.pin_code_hash ? "Configuré" : "Non configuré"}
              </span>
           </div>

           <button className="w-full py-4 rounded-2xl bg-white text-slate-900 border border-slate-200 font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
             {user.pin_code_hash ? "Modifier le Code PIN" : "Créer un Code PIN"}
           </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                 <History size={20} className="text-slate-400" />
                 <h4 className="text-sm font-black uppercase tracking-widest">Sessions Actives</h4>
              </div>
              <button className="text-[9px] font-black text-red-500 hover:underline uppercase tracking-widest">Déconnecter tous les autres appareils</button>
            </div>

            <div className="space-y-3">
               {[1, 2].map(i => (
                 <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between group hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                          <Monitor size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-black">Chrome sur Windows</p>
                          <p className="text-[10px] text-slate-400 font-bold">Dernière activité : Il y a 5 min • Abidjan, CI</p>
                       </div>
                    </div>
                    {i === 1 ? (
                      <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full uppercase">Session Actuelle</span>
                    ) : (
                      <button className="text-slate-300 hover:text-red-500 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    )}
                 </div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );

  const renderKYC = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
       <div className="space-y-4">
          <h3 className="text-2xl font-black italic">Vérification d'Identité (KYC)</h3>
          <p className="text-slate-400 text-xs font-medium">Accédez à plus de fonctionnalités en validant votre identité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { level: 1, title: 'Basique', status: 'completed', desc: 'Email & Téléphone validés', color: 'bg-slate-500' },
           { level: 2, title: 'Intermédiaire', status: 'current', desc: 'Pièce d\'identité requise', color: 'bg-primary' },
           { level: 3, title: 'Avancé', status: 'pending', desc: 'Justificatif de domicile', color: 'bg-secondary' }
         ].map((lvl, idx) => (
           <div key={idx} className={cn(
             "relative p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center text-center space-y-4 overflow-hidden",
             lvl.status === 'completed' ? "border-emerald-500/20 bg-emerald-50/10" : 
             lvl.status === 'current' ? "border-primary bg-primary/5 shadow-2xl scale-105" : "border-slate-100 opacity-50"
           )}>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg", lvl.color)}>
                {lvl.level}
              </div>
              <h4 className="font-black text-lg">{lvl.title}</h4>
              <p className="text-[10px] text-slate-500 font-bold italic">{lvl.desc}</p>
              
              <div className="pt-4 w-full">
                {lvl.status === 'completed' ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
                    <CheckCircle size={14} /> Validé
                  </div>
                ) : lvl.status === 'current' ? (
                  <button className="w-full bg-primary text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    Démarrer la vérification
                  </button>
                ) : (
                   <span className="text-slate-300 text-[10px] font-black uppercase">Veuillez valider le niveau {lvl.level - 1}</span>
                )}
              </div>
           </div>
         ))}
      </div>

      <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex gap-6 items-start">
         <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
           <AlertTriangle size={24} />
         </div>
         <div className="space-y-2">
            <h5 className="font-black text-sm text-amber-900">Pourquoi faire le KYC ?</h5>
            <ul className="text-xs text-amber-800 space-y-2 list-disc pl-4 font-medium italic">
              <li>Possibilité de publier des annonces premium</li>
              <li>Participation prioritaire aux événements exclusifs</li>
              <li>Badge "Vérifié" sur votre profil public</li>
              <li>Plafonds de transaction plus élevés</li>
            </ul>
         </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
       <div className="space-y-4">
          <h3 className="text-2xl font-black italic">Activité & Statistiques</h3>
          <p className="text-slate-400 text-xs font-medium">Suivez votre progression et votre engagement sur la plateforme.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
           { label: 'Articles lus', val: user.read_count || 142, icon: Eye, color: 'text-primary' },
           { label: 'Points fidélité', val: user.loyalty_points || 2500, icon: Award, color: 'text-amber-500' },
           { label: 'Série actuelle', val: `${user.streak_days || 7} j`, icon: TrendingUp, color: 'text-orange-500' },
           { label: 'Badges reçus', val: user.badges?.length || 5, icon: Shield, color: 'text-secondary' }
         ].map((stat, idx) => (
           <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-2 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50", stat.color)}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-black italic tracking-tighter">{stat.val}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
           </div>
         ))}
      </div>

      <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
             <History size={20} className="text-slate-400" />
             <h4 className="text-sm font-black uppercase tracking-widest">Historique des 30 derniers jours</h4>
          </div>
          <div className="h-64 flex items-end gap-2 px-4">
             {[30, 45, 20, 60, 40, 55, 70, 40, 30, 50, 65, 40, 30, 60, 80, 50, 40, 30, 20, 45, 60, 70, 50, 40, 30, 40, 55, 65, 70, 85].map((h, idx) => (
               <div key={idx} className="flex-1 group relative">
                 <div 
                  className={cn("w-full bg-slate-100 rounded-t-lg group-hover:bg-primary transition-all", idx === 29 && "bg-primary")} 
                  style={{ height: `${h}%` }}
                 />
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                   {h} interactions
                 </div>
               </div>
             ))}
          </div>
          <div className="flex justify-between px-4 text-[9px] font-black text-slate-400 uppercase">
             <span>Il y a 30 jours</span>
             <span>Aujourd'hui</span>
          </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
       <div className="space-y-4">
          <h3 className="text-2xl font-black italic">Préférences d'Utilisation</h3>
          <p className="text-slate-400 text-xs font-medium">Personnalisez votre expérience selon vos goûts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest border-b border-slate-50 pb-4">Affichage & Langue</h4>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-2 italic">Langue d'interface</label>
              <div className="grid grid-cols-3 gap-2">
                 {['Français', 'Anglais', 'Dioula'].map(lang => (
                   <button 
                    key={lang}
                    onClick={() => setFormData({...formData, language: lang})}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-black uppercase transition-all",
                      (formData.language || 'Français') === lang ? "bg-primary text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    )}
                   >
                     {lang}
                   </button>
                 ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-2 italic">Thème visuel</label>
              <div className="flex bg-slate-50 p-1 rounded-2xl">
                 <button 
                  onClick={() => setFormData({...formData, theme: 'light'})}
                  className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all", formData.theme !== 'dark' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}
                 >
                   <Sun size={14} /> Clair
                 </button>
                 <button 
                  onClick={() => setFormData({...formData, theme: 'dark'})}
                  className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all", formData.theme === 'dark' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}
                 >
                   <Moon size={14} /> Sombre
                 </button>
              </div>
            </div>
         </div>

         <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest border-b border-slate-50 pb-4">Notifications & Alertes</h4>
            
            <div className="space-y-4">
               {[
                 { id: 'notif_articles', label: 'Nouveaux articles', icon: FileText },
                 { id: 'notif_events', label: 'Rappels d\'événements', icon: Calendar },
                 { id: 'notif_newsletter', label: 'Newsletter hebdomadaire', icon: Mail },
                 { id: 'notif_sounds', label: 'Sons de notification', icon: Bell }
               ].map(item => (
                 <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <item.icon size={18} className="text-slate-400" />
                       <span className="text-xs font-bold text-slate-600">{item.label}</span>
                    </div>
                    <button 
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-colors duration-300",
                        true ? "bg-primary" : "bg-slate-300"
                      )}
                    >
                      <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300", true ? "right-1" : "left-1")} />
                    </button>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'personal', label: 'Profil', icon: User, render: renderPersonal },
    { id: 'contact', label: 'Contact', icon: Mail, render: renderContact },
    { id: 'security', label: 'Sécurité', icon: Lock, render: renderSecurity },
    { id: 'kyc', label: 'Vérification', icon: Shield, render: renderKYC },
    { id: 'activity', label: 'Activité', icon: TrendingUp, render: renderActivity },
    { id: 'preferences', label: 'Réglages', icon: Bell, render: renderPreferences },
    { id: 'billing', label: 'Facturation', icon: CreditCard, render: () => <div className="p-12 text-center text-slate-400 italic font-bold">Section Facturation bientôt disponible.</div> },
    { id: 'data', label: 'Vie Privée', icon: Database, render: () => <div className="p-12 text-center text-slate-400 italic font-bold">Options de gestion des données.</div> }
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.render || renderPersonal;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-2">
           <div className="bg-white rounded-[2.5rem] p-4 shadow-xl border border-slate-100 space-y-2">
             {tabs.map(tab => (
               <ProfileTab 
                 key={tab.id}
                 active={activeTab === tab.id}
                 icon={tab.icon}
                 label={tab.label}
                 onClick={() => setActiveTab(tab.id)}
               />
             ))}
           </div>
           
           <div className="bg-red-50 rounded-[2.5rem] p-4 border border-red-100 mt-6">
              <button 
                onClick={async () => {
                  if(confirm("Voulez-vous vraiment vous déconnecter ?")) {
                    await signOut();
                    window.location.reload();
                  }
                }}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-100 transition-all font-mono"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
           </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9">
           <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col min-h-[700px]">
              <div className="p-12 flex-1">
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ActiveComponent />
                    </motion.div>
                 </AnimatePresence>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full animate-pulse", isSaving ? "bg-amber-500" : "bg-emerald-500")} />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">
                      {isSaving ? "Synchronisation en cours..." : "Toutes les modifications sont enregistrées"}
                    </span>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setFormData(user)}
                      className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                    >
                      Réinitialiser
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isSaving ? "Enregistrement..." : "Appliquer les modifications"}
                    </button>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

const Monitor = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>
  </svg>
);

const ImageIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);
