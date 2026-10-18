import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { Input, Textarea } from '../ui/Input';
import { 
  Sparkles, 
  Wand2, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Bookmark, 
  Image as ImageIcon, 
  Palette, 
  Type, 
  ListFilter, 
  ExternalLink, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  FolderHeart, 
  Sliders, 
  Send, 
  Eye,
  Zap,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  Coins,
  Upload,
  X,
  Camera,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  generateAIContentPoster,
  generateAIPosterArtwork,
  createProceduralTechArtwork
} from '../../packages/ai/geminiClient';

function YoutubeIcon({ className = "w-4 h-4", size, ...props }) {
  const s = size ? `${size}px` : undefined;
  return (
    <svg 
      className={className} 
      style={s ? { width: s, height: s } : undefined} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function AIContentCreator({
  currentUser,
  userProfile,
  campaigns = [],
  activeCreator,
  brandCredits = 250,
  onDeductBrandCredits,
  onOpenTopup
}) {
  // Creation Choice Modal: 'presets' | 'new' | null
  const [creationModal, setCreationModal] = useState(null); // 'presets' | 'new' | null

  // Format selection
  const [aspectRatio, setAspectRatio] = useState('1:1'); // '1:1' (Community) | '16:9' (Thumbnail) | '9:16' (Shorts)

  // Current Active Poster Data
  const [activeTemplateName, setActiveTemplateName] = useState('Tech Sponsorship Call');
  const [backgroundColor, setBackgroundColor] = useState('#0a0f1d');
  const [accentColor1, setAccentColor1] = useState('#e11d48');
  const [accentColor2, setAccentColor2] = useState('#38bdf8');
  const [mainHeading, setMainHeading] = useState('CALLING ELITE TECH CREATORS');
  const [graphicDescription, setGraphicDescription] = useState(
    'Vector illustration of a developer and creator collaborating at an ergonomic workstation with digital tablets, floating holographic glowing gears, soundwaves, and 4K playback monitors'
  );
  const [graphicAssetUrl, setGraphicAssetUrl] = useState('/creator_collab_poster.jpg');
  const [sectionText, setSectionText] = useState(
    'Partnering with verified YouTube developers and tech creators to showcase next-generation developer tooling. Pre-funded milestone escrow contracts guaranteed.'
  );
  const [listHeader, setListHeader] = useState('Creator Requirements & Deliverables');
  const [requirementsList, setRequirementsList] = useState([
    'Min. 15,000+ verified YouTube subscribers',
    '1x 10-12 min dedicated 4K tutorial with code breakdown',
    '2x YouTube Shorts with high-retention opening hooks',
    '100% pre-funded escrow locked upon contract start'
  ]);
  const [newRequirement, setNewRequirement] = useState('');
  const [ctaText, setCtaText] = useState('Apply for Sponsorship');
  const [contactInfo, setContactInfo] = useState('Apply via nefra.io/campaigns/cursor • partnerships@nefra.io');

  // Captions & Social Media Content
  const [captionText, setCaptionText] = useState(
    '🚀 ANNOUNCEMENT: CREATOR SPONSORSHIP PROGRAM\n\nWe are searching for authentic YouTube creators and developers to test, benchmark, and showcase our latest release.\n\n✨ What We Provide:\n• $1,500 – $4,500 guaranteed 100% pre-funded escrow payout\n• Early alpha access & direct Slack channel with our engineering team\n• Full creative freedom with zero micromanagement\n\n📋 Deliverables:\n• 1x Dedicated 4K workflow tutorial\n• 2x High-tempo algorithmic Shorts\n• Companion GitHub repository\n\n👇 Drop your proposal directly through Nefra Escrow Portal to lock your contract slot!'
  );
  const [hashtags, setHashtags] = useState([
    '#YouTubeCreators',
    '#TechSponsorship',
    '#DeveloperTools',
    '#NefraCreators',
    '#YouTubeCommunity',
    '#FreelanceCollab'
  ]);
  const [newHashtag, setNewHashtag] = useState('');

  // New Custom Content Form State
  const [newTopic, setNewTopic] = useState('');
  const [newGoal, setNewGoal] = useState('Hire YouTube tech creators for 4K video reviews');
  const [selectedTheme, setSelectedTheme] = useState('dark_crimson'); // 'dark_crimson' | 'emerald_cyan' | 'violet_rose' | 'amber_gold'

  // UI Interactive State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopiedPost, setIsCopiedPost] = useState(false);
  const [isCopiedTags, setIsCopiedTags] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [isRegeneratingVisual, setIsRegeneratingVisual] = useState(false);
  const [displayMode, setDisplayMode] = useState('image_only'); // 'image_only' (Default standalone AI image + Community copy) | 'composite_poster'

  // Uploaded Photos State (Supports up to 2 images: Brand Logo and Product/Feature Asset)
  const [uploadedImages, setUploadedImages] = useState([]);
  const logoInputRef = useRef(null);
  const visualInputRef = useRef(null);
  const modalLogoInputRef = useRef(null);
  const modalVisualInputRef = useRef(null);

  // Derived image slots
  const brandLogo = uploadedImages.find((img) => img.role === 'logo') || (uploadedImages.length > 0 && uploadedImages[0].role !== 'visual' ? uploadedImages[0] : null);
  const secondaryVisual = uploadedImages.find((img) => img.role === 'visual') || (uploadedImages.length === 2 && uploadedImages[1].role !== 'logo' ? uploadedImages[1] : null);

  // Parse SVG content for native vector rendering inside the poster SVG
  const svgParsedContent = useMemo(() => {
    if (!graphicAssetUrl || typeof graphicAssetUrl !== 'string') return null;
    try {
      if (graphicAssetUrl.startsWith('data:image/svg+xml;base64,')) {
        const base64Part = graphicAssetUrl.replace('data:image/svg+xml;base64,', '');
        const decoded = atob(base64Part);
        return decoded.replace(/<svg[^>]*>/i, '').replace(/<\/svg>/i, '').trim();
      }
      if (graphicAssetUrl.startsWith('data:image/svg+xml,')) {
        const decoded = decodeURIComponent(graphicAssetUrl.replace('data:image/svg+xml,', ''));
        return decoded.replace(/<svg[^>]*>/i, '').replace(/<\/svg>/i, '').trim();
      }
      if (graphicAssetUrl.trim().startsWith('<svg')) {
        return graphicAssetUrl.replace(/<svg[^>]*>/i, '').replace(/<\/svg>/i, '').trim();
      }
    } catch (err) {
      console.warn('SVG parse error in poster view:', err);
    }
    return null;
  }, [graphicAssetUrl]);

  // Handler for uploading/replacing images (up to 2)
  const handleImageUpload = (e, slotRole = 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Image size exceeds 8MB. Please choose a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setUploadedImages((prev) => {
        const existingIdx = prev.findIndex((item) => item.role === slotRole);
        const newItem = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          url: dataUrl,
          role: slotRole
        };

        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = newItem;
          return updated;
        }

        if (prev.length >= 2) {
          // If 2 already exist, replace the opposite or second slot
          return [prev[0], newItem];
        }

        return [...prev, newItem];
      });
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.6 } });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = (idToRemove) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  const handleToggleRole = (idToToggle) => {
    setUploadedImages((prev) =>
      prev.map((img) => {
        if (img.id === idToToggle) {
          return { ...img, role: img.role === 'logo' ? 'visual' : 'logo' };
        }
        return img;
      })
    );
  };

  const handleLoadSampleLogo = () => {
    const brandTitle = userProfile?.companyName || 'Brand';
    const sampleItem = {
      id: `sample_logo_${Date.now()}`,
      name: `${brandTitle.toLowerCase()}_logo.svg`,
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='28' fill='%23e11d48'/><polygon points='34,26 78,50 34,74' fill='%23ffffff'/><circle cx='76' cy='26' r='10' fill='%2338bdf8'/></svg>",
      role: 'logo'
    };

    setUploadedImages((prev) => {
      const withoutLogo = prev.filter((img) => img.role !== 'logo');
      return [sampleItem, ...withoutLogo].slice(0, 2);
    });
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
  };

  // Saved Posts Library State
  const [savedPosts, setSavedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('nefra_saved_social_posts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const posterRef = useRef(null);

  // Sync saved posts
  useEffect(() => {
    try {
      localStorage.setItem('nefra_saved_social_posts', JSON.stringify(savedPosts));
    } catch (e) {}
  }, [savedPosts]);

  // Color Swatches
  const bgPresets = ['#0a0f1d', '#09090b', '#18181b', '#030712', '#1e1b4b'];
  const accent1Presets = ['#e11d48', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
  const accent2Presets = ['#38bdf8', '#06b6d4', '#10b981', '#f43f5e', '#ec4899'];

  // Curated High-Converting Presets
  const PRESETS_LIST = [
    {
      id: 'Sponsorship Call',
      title: 'Tech Sponsorship Call',
      badge: 'Popular',
      color: '#e11d48',
      desc: 'Dedicated 4K tech review & developer workflow tutorial sponsorship with $1,500 – $4,500 escrow deposit.',
      art: '/creator_collab_poster.jpg'
    },
    {
      id: 'Product Launch',
      title: 'Product Launch Bounty',
      badge: 'Launch Week',
      color: '#10b981',
      desc: 'Flagship launch week embargo call for software, devtools, and SaaS YouTube creators.',
      art: '/tech_launch_poster.jpg'
    },
    {
      id: 'Review Bounty',
      title: 'UI & Devtool Teardown',
      badge: 'Bounty',
      color: '#8b5cf6',
      desc: 'Hands-on architectural review comparing latency against legacy tools with $2,000 escrow milestone.',
      art: '/creator_collab_poster.jpg'
    },
    {
      id: 'Shorts Collab',
      title: 'High-Velocity YouTube Shorts',
      badge: 'Shorts & FYP',
      color: '#f59e0b',
      desc: 'Commissioning 3-packs of 60s vertical Shorts focusing on quick productivity hacks and 3s retention hooks.',
      art: '/tech_launch_poster.jpg'
    }
  ];

  // Theme palettes for New Creation
  const THEME_OPTIONS = [
    { id: 'dark_crimson', label: 'Dark Tech (Crimson & Cyan)', bg: '#0a0f1d', a1: '#e11d48', a2: '#38bdf8' },
    { id: 'emerald_cyan', label: 'Launch Neon (Emerald & Mint)', bg: '#09090b', a1: '#10b981', a2: '#06b6d4' },
    { id: 'violet_rose', label: 'Creative Studio (Violet & Rose)', bg: '#18181b', a1: '#8b5cf6', a2: '#f43f5e' },
    { id: 'amber_gold', label: 'Velocity Gold (Amber & Pink)', bg: '#0a0f1d', a1: '#f59e0b', a2: '#ec4899' }
  ];

  // Load Preset
  const handleSelectPreset = async (presetId) => {
    if (typeof brandCredits === 'number' && brandCredits < 20) {
      if (onOpenTopup) {
        onOpenTopup();
      } else {
        alert('Insufficient Brand Credits. You need at least 20 Brand Credits to generate AI poster content. Please top up your business wallet.');
      }
      return;
    }

    setIsGenerating(true);
    setCreationModal(null);
    try {
      if (onDeductBrandCredits) {
        onDeductBrandCredits(20, `AI Content Creator - Preset (${presetId})`);
      }

      const data = await generateAIContentPoster({
        topic: presetId,
        brandName: userProfile?.companyName || 'Cursor / Anysphere',
        channel: 'youtube'
      });

      setActiveTemplateName(presetId);
      setBackgroundColor(data.backgroundColor);
      setAccentColor1(data.accentColor1);
      setAccentColor2(data.accentColor2);
      setMainHeading(data.mainHeading);
      setGraphicDescription(data.graphicDescription);
      if (data.graphicAssetUrl) setGraphicAssetUrl(data.graphicAssetUrl);
      setSectionText(data.sectionText);
      setListHeader(data.listHeader);
      setRequirementsList(data.requirementsList);
      setCtaText(data.ctaText);
      setContactInfo(data.contactInfo);
      setCaptionText(data.postBody || data.captions);
      setHashtags(data.hashtags);

      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.warn('Preset load error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate New Content (AI Guided)
  const handleCreateNewOne = async (e) => {
    if (e) e.preventDefault();
    if (!newTopic.trim()) return;

    if (typeof brandCredits === 'number' && brandCredits < 20) {
      if (onOpenTopup) {
        onOpenTopup();
      } else {
        alert('Insufficient Brand Credits. You need at least 20 Brand Credits to generate AI poster content. Please top up your business wallet.');
      }
      return;
    }

    setIsGenerating(true);
    setCreationModal(null);
    try {
      if (onDeductBrandCredits) {
        onDeductBrandCredits(20, `AI Content Creator - "${newTopic.trim().slice(0, 30)}"`);
      }

      const refImages = uploadedImages.map(img => ({ url: img.url, role: img.role, name: img.name }));

      const data = await generateAIContentPoster({
        topic: newTopic.trim(),
        brandName: userProfile?.companyName || 'My Brand',
        channel: 'youtube',
        category: {
          bg: theme.bg,
          a1: theme.a1,
          a2: theme.a2,
          aspectRatio,
          referenceImages: refImages
        }
      });

      setActiveTemplateName(newTopic.trim());
      setBackgroundColor(theme.bg);
      setAccentColor1(theme.a1);
      setAccentColor2(theme.a2);
      setMainHeading(data.mainHeading);
      setGraphicDescription(data.graphicDescription);
      
      // Clear previous visual override so the new AI generated artwork is shown
      setUploadedImages(prev => prev.filter(img => img.role !== 'visual'));

      // Use real generated AI artwork (never static placeholder)
      if (data.graphicAssetUrl) {
        setGraphicAssetUrl(data.graphicAssetUrl);
      } else {
        const customArt = await generateAIPosterArtwork({
          topic: newTopic.trim(),
          graphicDescription: data.graphicDescription,
          accent1: theme.a1,
          accent2: theme.a2,
          bg: theme.bg,
          aspectRatio,
          referenceImages: refImages
        });
        setGraphicAssetUrl(customArt);
      }

      setSectionText(data.sectionText);
      setListHeader(data.listHeader);
      setRequirementsList(data.requirementsList);
      setCtaText(data.ctaText);
      setContactInfo(data.contactInfo);
      setCaptionText(data.postBody || data.captions);
      setHashtags(data.hashtags);

      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      console.warn('New generation error:', e);
    } finally {
      setIsGenerating(false);
      setNewTopic('');
    }
  };

  // Re-generate fresh AI visual for current active topic
  const handleRegenerateVisual = async () => {
    if (typeof brandCredits === 'number' && brandCredits < 20) {
      if (onOpenTopup) onOpenTopup();
      else alert('Insufficient Brand Credits. You need at least 20 Brand Credits to generate AI image content.');
      return;
    }

    setIsRegeneratingVisual(true);
    try {
      if (onDeductBrandCredits) {
        onDeductBrandCredits(20, `Nano Banana Visual Synthesis - "${activeTemplateName}"`);
      }
      const refImages = uploadedImages.map(img => ({ url: img.url, role: img.role, name: img.name }));
      const promptToUse = graphicDescription?.trim() || activeTemplateName;
      const freshArt = await generateAIPosterArtwork({
        topic: activeTemplateName,
        graphicDescription: promptToUse,
        accent1: accentColor1,
        accent2: accentColor2,
        bg: backgroundColor,
        aspectRatio,
        referenceImages: refImages
      });
      if (freshArt) {
        setGraphicAssetUrl(freshArt);
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.warn('Error regenerating visual:', err);
    } finally {
      setIsRegeneratingVisual(false);
    }
  };

  // Copy Post
  const handleCopyFullPost = () => {
    const fullText = `${captionText}\n\n${hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setIsCopiedPost(true);
    setTimeout(() => setIsCopiedPost(false), 2500);
  };

  // Copy Tags
  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(hashtags.join(' '));
    setIsCopiedTags(true);
    setTimeout(() => setIsCopiedTags(false), 2500);
  };

  // Save to Library
  const handleSavePost = () => {
    const postItem = {
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: activeTemplateName,
      mainHeading,
      graphicAssetUrl,
      uploadedImages: [...uploadedImages],
      backgroundColor,
      accentColor1,
      accentColor2,
      sectionText,
      listHeader,
      requirementsList,
      ctaText,
      contactInfo,
      captionText,
      hashtags
    };

    setSavedPosts([postItem, ...savedPosts]);
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
  };

  // Download Genuine Generated Image as PNG / JPEG
  const handleDownloadImage = (format = 'png') => {
    if (!graphicAssetUrl) return;

    const baseName = activeTemplateName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'youtube_community_post';
    const ext = (format === 'jpg' || format === 'jpeg') ? 'jpg' : 'png';
    const fileName = `youtube_community_${baseName}_nano_banana.${ext}`;

    if (graphicAssetUrl.startsWith('data:image/')) {
      const link = document.createElement('a');
      link.href = graphicAssetUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    fetch(graphicAssetUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        const link = document.createElement('a');
        link.href = graphicAssetUrl;
        link.target = '_blank';
        link.download = fileName;
        link.click();
      });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Clear Creation Choice Buttons */}
      <div className="border-b border-[#27272a] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#fafafa] flex items-center gap-2">
              <Wand2 className="text-[#e11d48]" size={22} />
              AI Content Creator
            </h1>
            <Badge variant="action" className="text-[10px] bg-[#e11d48]/15 border-[#e11d48]/30 text-[#e11d48]">
              YouTube Posts Ready
            </Badge>
            <Badge className="text-[10px] bg-yellow-500/10 border-yellow-500/30 text-yellow-400 font-semibold flex items-center gap-1">
              🍌 Vertex AI Nano Banana
            </Badge>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Current Template: <strong className="text-[#fafafa]">{activeTemplateName}</strong> • Optimized for YouTube Community & video promotion.
          </p>
        </div>

        {/* 2 Clear Creation Choice Buttons & Brand Credit Indicator */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#09090b] border border-[#27272a] text-xs">
            <Coins size={13} className="text-[#3b82f6]" />
            <span className="font-semibold text-white tabular-nums">{brandCredits}</span>
            <span className="text-[#71717a] hidden sm:inline">Brand Credits</span>
            {onOpenTopup && (
              <button 
                onClick={onOpenTopup}
                title="Top-up Brand Credits"
                className="ml-1 text-[10px] text-[#3b82f6] hover:underline font-semibold cursor-pointer"
              >
                + Top-up
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCreationModal('presets')}
            className="border-[#27272a] hover:border-[#3b82f6] text-xs space-x-1.5 cursor-pointer bg-[#18181b]"
          >
            <Zap size={14} className="text-[#3b82f6]" />
            <span>Load from Presets</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setCreationModal('new')}
            className="space-x-1.5 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>Create New with AI</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSavedDrawerOpen(true)}
            className="border-[#27272a] text-xs space-x-1 cursor-pointer text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <FolderHeart size={14} className="text-[#e11d48]" />
            <span>Saved ({savedPosts.length})</span>
          </Button>
        </div>
      </div>

      {/* Main Streamlined Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Ready Copy, Hashtags & Simple Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Brand Media & Photos Card (Up to 2 Images) */}
          <Card className="p-4 space-y-3.5 bg-[#0e0e11] border-[#27272a]">
            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={logoInputRef}
              onChange={(e) => handleImageUpload(e, 'logo')}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
            />
            <input
              type="file"
              ref={visualInputRef}
              onChange={(e) => handleImageUpload(e, 'visual')}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-[#e11d48]/10 text-[#e11d48]">
                  <Camera size={14} />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#fafafa]">Brand Assets & Photos</h3>
                  <p className="text-[10px] text-[#71717a]">Attach brand logo & promo image (up to 2)</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  uploadedImages.length === 2
                    ? 'bg-[#10b981]/15 border-[#10b981]/30 text-[#10b981]'
                    : uploadedImages.length === 1
                    ? 'bg-[#3b82f6]/15 border-[#3b82f6]/30 text-[#38bdf8]'
                    : 'bg-[#27272a] border-[#3f3f46] text-[#a1a1aa]'
                }`}>
                  {uploadedImages.length} / 2 Added
                </span>

                {!brandLogo && (
                  <button
                    type="button"
                    onClick={handleLoadSampleLogo}
                    title="Load quick test logo"
                    className="text-[10px] text-[#38bdf8] hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                  >
                    <span>⚡ Demo Logo</span>
                  </button>
                )}
              </div>
            </div>

            {/* 2 Dedicated Upload Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Slot 1: Brand Logo */}
              <div className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a] flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#fafafa] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
                    Image 1: Brand Logo
                  </span>
                  <span className="text-[9px] text-[#71717a]">Header & Watermark</span>
                </div>

                {brandLogo ? (
                  <div className="flex items-center space-x-2 bg-[#09090b] p-2 rounded-lg border border-[#27272a]">
                    <div className="w-9 h-9 rounded-md overflow-hidden bg-[#18181b] border border-[#3f3f46] shrink-0 flex items-center justify-center p-1">
                      <img src={brandLogo.url} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-[#fafafa] truncate">{brandLogo.name}</p>
                      <p className="text-[9px] text-[#10b981]">Active in Poster</p>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        title="Replace logo"
                        className="p-1 text-[#a1a1aa] hover:text-[#fafafa] rounded hover:bg-[#27272a] cursor-pointer"
                      >
                        <RefreshCw size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(brandLogo.id)}
                        title="Remove logo"
                        className="p-1 text-[#71717a] hover:text-[#e11d48] rounded hover:bg-[#27272a] cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full py-3 px-2 border border-dashed border-[#3f3f46] hover:border-[#fafafa] rounded-lg bg-[#09090b]/50 hover:bg-[#18181b] transition-all flex flex-col items-center justify-center space-y-1 text-center cursor-pointer group"
                  >
                    <Upload size={14} className="text-[#a1a1aa] group-hover:text-[#fafafa] group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-medium text-[#e4e4e7]">Upload Brand Logo</span>
                    <span className="text-[9px] text-[#71717a]">PNG / SVG transparent</span>
                  </button>
                )}
              </div>

              {/* Slot 2: Product / Feature Visual */}
              <div className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a] flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#fafafa] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                    Image 2: Product Photo
                  </span>
                  <span className="text-[9px] text-[#71717a]">Hero Artwork</span>
                </div>

                {secondaryVisual ? (
                  <div className="flex items-center space-x-2 bg-[#09090b] p-2 rounded-lg border border-[#27272a]">
                    <div className="w-9 h-9 rounded-md overflow-hidden bg-[#18181b] border border-[#3f3f46] shrink-0 flex items-center justify-center">
                      <img src={secondaryVisual.url} alt="Product visual" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-[#fafafa] truncate">{secondaryVisual.name}</p>
                      <p className="text-[9px] text-[#38bdf8]">Active in Poster</p>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => visualInputRef.current?.click()}
                        title="Replace photo"
                        className="p-1 text-[#a1a1aa] hover:text-[#fafafa] rounded hover:bg-[#27272a] cursor-pointer"
                      >
                        <RefreshCw size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(secondaryVisual.id)}
                        title="Remove photo"
                        className="p-1 text-[#71717a] hover:text-[#e11d48] rounded hover:bg-[#27272a] cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => visualInputRef.current?.click()}
                    className="w-full py-3 px-2 border border-dashed border-[#3f3f46] hover:border-[#fafafa] rounded-lg bg-[#09090b]/50 hover:bg-[#18181b] transition-all flex flex-col items-center justify-center space-y-1 text-center cursor-pointer group"
                  >
                    <Camera size={14} className="text-[#a1a1aa] group-hover:text-[#fafafa] group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-medium text-[#e4e4e7]">Upload Product Photo</span>
                    <span className="text-[9px] text-[#71717a]">PNG / JPG / WebP</span>
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* Card: Nano Banana Image Requirement & Direct Synthesis */}
          <Card className="p-4 space-y-3 bg-[#0e0e11] border-[#27272a]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#fafafa] flex items-center gap-1.5">
                <Sparkles size={14} className="text-yellow-400" />
                <span>Nano Banana Image Requirement</span>
              </span>
              <span className="text-[10px] text-yellow-400/90 font-semibold px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/30">
                {uploadedImages.length > 0 ? `${uploadedImages.length} Image(s) Attached` : 'No Images Attached'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-[#a1a1aa] font-medium block">
                Requirement & Details for Nano Banana:
              </label>
              <Textarea
                rows={2}
                value={graphicDescription}
                onChange={(e) => setGraphicDescription(e.target.value)}
                placeholder="e.g. Sponsor Copyy: Mac's smartest clipboard app, sleek macOS desktop workspace, highlighting fast copy-paste snippets"
                className="bg-[#000000] text-xs font-medium"
              />
            </div>

            <Button
              size="sm"
              disabled={isRegeneratingVisual || isGenerating}
              onClick={handleRegenerateVisual}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs space-x-1.5 cursor-pointer transition-all shadow-md"
            >
              <Sparkles size={13} className={isRegeneratingVisual ? 'animate-spin' : ''} />
              <span>{isRegeneratingVisual ? 'Synthesizing with Nano Banana...' : '🍌 Generate Image with Nano Banana (20 Credits)'}</span>
            </Button>
          </Card>

          {/* Card 1: Ready-to-use YouTube Community Post Copy */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#fafafa] flex items-center gap-1.5">
                <YoutubeIcon size={15} className="text-[#e11d48]" />
                YouTube Community Post Copy
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyFullPost}
                className="border-[#27272a] text-xs space-x-1 cursor-pointer hover:border-[#fafafa]"
              >
                {isCopiedPost ? (
                  <>
                    <Check size={12} className="text-[#10b981]" />
                    <span className="text-[#10b981]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Post</span>
                  </>
                )}
              </Button>
            </div>

            <div className="p-3 bg-[#000000] rounded-lg border border-[#27272a] text-xs text-[#d4d4d8] whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto font-sans">
              {captionText}
              {'\n\n'}
              <span className="text-[#38bdf8] font-medium">{hashtags.join(' ')}</span>
            </div>

            {/* Attached Images Preview in Post */}
            {uploadedImages.length > 0 && (
              <div className="p-2.5 bg-[#000000] rounded-lg border border-[#27272a] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-[#71717a]">
                  <span className="flex items-center gap-1 font-semibold text-[#a1a1aa]">
                    <ImageIcon size={11} className="text-[#e11d48]" />
                    Attached Media ({uploadedImages.length}/2 photos)
                  </span>
                  <span className="text-[#10b981]">Attached to Post</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="relative group rounded-md overflow-hidden border border-[#27272a] bg-[#141417] h-14 flex items-center justify-center">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-2">
                        <span className="text-[9px] text-white font-medium truncate max-w-[70%]">
                          {img.role === 'logo' ? 'Brand Logo' : 'Product Photo'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="text-red-400 hover:text-red-300 p-0.5 cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-[#71717a] pt-1">
              <span>Ready to paste directly into your YouTube Community tab</span>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="text-[#e11d48] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Share now</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </Card>

          {/* Card 2: Discovery Hashtags */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#fafafa] flex items-center gap-1.5">
                <ListFilter size={13} className="text-[#38bdf8]" />
                Target Hashtags ({hashtags.length})
              </span>
              <button
                onClick={handleCopyHashtags}
                className="text-[11px] text-[#38bdf8] hover:underline cursor-pointer flex items-center gap-1"
              >
                {isCopiedTags ? <Check size={11} /> : <Copy size={11} />}
                <span>{isCopiedTags ? 'Copied' : 'Copy Tags'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-md bg-[#18181b] border border-[#27272a] text-[11px] text-[#fafafa]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>

          {/* Optional Collapsible: Customize Text & Colors */}
          <div className="border border-[#27272a] rounded-xl overflow-hidden bg-[#09090b]">
            <button
              onClick={() => setShowCustomizer(!showCustomizer)}
              className="w-full p-3.5 flex items-center justify-between text-xs font-semibold text-[#fafafa] hover:bg-[#121215] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sliders size={14} className="text-[#71717a]" />
                <span>Customize Poster Text & Colors (Optional)</span>
              </span>
              {showCustomizer ? <ChevronUp size={14} className="text-[#71717a]" /> : <ChevronDown size={14} className="text-[#71717a]" />}
            </button>

            {showCustomizer && (
              <div className="p-4 pt-2 border-t border-[#27272a] space-y-3 text-xs">
                {/* Main Heading Input */}
                <div>
                  <label className="text-[11px] text-[#71717a] font-medium block mb-1">Headline Text</label>
                  <Input
                    value={mainHeading}
                    onChange={(e) => setMainHeading(e.target.value)}
                    className="bg-[#000000] text-xs font-semibold"
                  />
                </div>

                {/* Section Overview */}
                <div>
                  <label className="text-[11px] text-[#71717a] font-medium block mb-1">Section Overview</label>
                  <Textarea
                    rows={2}
                    value={sectionText}
                    onChange={(e) => setSectionText(e.target.value)}
                    className="bg-[#000000] text-xs"
                  />
                </div>

                {/* Quick Color Swatches */}
                <div>
                  <label className="text-[11px] text-[#71717a] font-medium block mb-1.5">Accent Color</label>
                  <div className="flex items-center space-x-2">
                    {accent1Presets.map(c => (
                      <button
                        key={c}
                        onClick={() => setAccentColor1(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border cursor-pointer transition-transform ${
                          accentColor1 === c ? 'border-white ring-2 ring-white/30 scale-110' : 'border-[#27272a]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* AI Visual Artwork Prompt & Regenerate */}
                <div className="pt-2 border-t border-[#27272a] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-[#71717a] font-medium block">AI Visual Artwork Description</label>
                    <button
                      type="button"
                      disabled={isRegeneratingVisual}
                      onClick={handleRegenerateVisual}
                      className="text-[11px] text-[#38bdf8] hover:underline flex items-center gap-1 font-semibold cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles size={11} className={isRegeneratingVisual ? 'animate-spin' : ''} />
                      <span>{isRegeneratingVisual ? 'Synthesizing...' : 'Regenerate Artwork'}</span>
                    </button>
                  </div>
                  <Textarea
                    rows={2}
                    value={graphicDescription}
                    onChange={(e) => setGraphicDescription(e.target.value)}
                    placeholder="Visual description for AI artwork..."
                    className="bg-[#000000] text-[11px]"
                  />
                </div>

                {/* CTA Button Text */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[11px] text-[#71717a] block mb-1">Button Text</label>
                    <Input
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="bg-[#000000] text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#71717a] block mb-1">Website URL</label>
                    <Input
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="bg-[#000000] text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center space-x-2 pt-1">
            <Button
              onClick={handleSavePost}
              className="flex-1 space-x-1.5 bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] border border-[#27272a] cursor-pointer"
            >
              <Bookmark size={14} className="text-[#e11d48]" />
              <span>Save to Library</span>
            </Button>

            <Button
              onClick={() => setIsShareModalOpen(true)}
              className="flex-1 space-x-1.5 bg-[#e11d48] hover:bg-[#be123c] text-white cursor-pointer"
            >
              <Share2 size={14} />
              <span>Share to YouTube</span>
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: Pure Generated Image from Vertex AI Nano Banana (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Format Selector Bar */}
          <div className="flex items-center justify-between text-xs text-[#71717a] flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold text-[#a1a1aa]">Format:</span>
              {[
                { id: '1:1', label: '1:1 Community' },
                { id: '16:9', label: '16:9 Video' },
                { id: '9:16', label: '9:16 Shorts' }
              ].map(fmt => (
                <button
                  key={fmt.id}
                  onClick={() => setAspectRatio(fmt.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    aspectRatio === fmt.id
                      ? 'bg-[#fafafa] text-[#000000]'
                      : 'bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa]'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-400/10 border border-yellow-400/30 text-yellow-300">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                Vertex AI Nano Banana
              </span>

              <Button
                size="sm"
                variant="outline"
                disabled={isRegeneratingVisual || isGenerating}
                onClick={handleRegenerateVisual}
                className="border-[#27272a] text-xs space-x-1 cursor-pointer hover:border-yellow-400 text-yellow-400 hover:text-white"
                title="Synthesize fresh image using your uploaded images and requirement"
              >
                <Sparkles size={12} className={isRegeneratingVisual ? 'animate-spin' : ''} />
                <span>{isRegeneratingVisual ? 'Synthesizing...' : '🍌 Nano Banana Visual'}</span>
              </Button>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  onClick={() => handleDownloadImage('png')}
                  className="bg-[#fafafa] hover:bg-[#e4e4e7] text-black text-xs space-x-1 font-semibold cursor-pointer"
                  title="Download genuine generated PNG image to upload to YouTube"
                >
                  <Download size={13} />
                  <span>Download PNG</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadImage('jpg')}
                  className="border-[#27272a] text-xs text-[#a1a1aa] hover:text-white hover:border-[#3f3f46] bg-[#18181b] cursor-pointer"
                  title="Download as JPG"
                >
                  <span>JPG</span>
                </Button>
              </div>
            </div>
          </div>

          {/* PURE GENERATED IMAGE DISPLAY */}
          <div className="relative rounded-2xl overflow-hidden border border-[#27272a] shadow-2xl bg-[#09090b] flex items-center justify-center transition-all group">
            {/* Loading / Generating Overlay */}
            {(isRegeneratingVisual || isGenerating) && (
              <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-yellow-400/30 border-t-yellow-400 animate-spin flex items-center justify-center" />
                  <span className="absolute inset-0 flex items-center justify-center text-xl">🍌</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#fafafa]">Google Vertex AI Nano Banana is Synthesizing</p>
                  <p className="text-xs text-[#a1a1aa] max-w-sm">
                    Multimodal reference active: analyzing {uploadedImages.length > 0 ? `${uploadedImages.length} uploaded brand asset(s)` : 'prompt requirement'} to create your standalone image...
                  </p>
                </div>
              </div>
            )}

            {/* The Standalone Generated Image */}
            <div className={`w-full flex items-center justify-center bg-[#070709] ${
              aspectRatio === '1:1' ? 'aspect-square' : aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-h-[75vh]'
            }`}>
              <img
                src={graphicAssetUrl}
                alt={activeTemplateName}
                className="w-full h-full object-contain select-none block"
              />
            </div>

            {/* Bottom Overlay Info & Quick Action */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-center justify-between pointer-events-auto">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-[#fafafa] font-semibold bg-[#18181b]/90 border border-[#27272a] px-2 py-0.5 rounded flex items-center gap-1">
                  <span>🍌 Nano Banana</span>
                  <span className="text-[#71717a]">•</span>
                  <span className="text-[#a1a1aa]">{aspectRatio}</span>
                </span>
                <span className="text-[10px] text-[#a1a1aa] hidden sm:inline">
                  Pure image response ready for YouTube Community
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleDownloadImage('png')}
                  className="bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-semibold space-x-1 cursor-pointer shadow-lg"
                >
                  <Download size={13} />
                  <span>Download for YouTube</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick YouTube Upload Helper Bar */}
          <div className="p-3 bg-[#111114] border border-[#27272a] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-[#e11d48]/15 text-[#e11d48] flex items-center justify-center font-bold text-xs shrink-0">
                1
              </span>
              <div>
                <p className="font-semibold text-[#fafafa]">Ready for YouTube Community</p>
                <p className="text-[11px] text-[#71717a]">
                  1. Download this generated image ➔ 2. Copy the post text on the left ➔ 3. Upload on YouTube Studio Community tab!
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyFullPost}
              className="border-[#27272a] text-xs space-x-1 cursor-pointer hover:border-[#fafafa] bg-[#18181b] shrink-0"
            >
              {isCopiedPost ? (
                <>
                  <Check size={12} className="text-[#10b981]" />
                  <span className="text-[#10b981]">Copied Text!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy Text</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. LOAD FROM PRESETS MODAL */}
      {/* ========================================================================= */}
      {creationModal === 'presets' && (
        <Dialog
          isOpen={Boolean(creationModal === 'presets')}
          onClose={() => setCreationModal(null)}
          title="Load from Proven Presets"
          description="Choose a pre-structured, high-converting template. Instantly loads your poster, caption copy, and tags."
          maxWidth="max-w-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {PRESETS_LIST.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-[#fafafa] transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <h4 className="text-xs font-bold text-[#fafafa] group-hover:text-[#38bdf8] transition-colors">
                      {p.title}
                    </h4>
                  </div>
                  <Badge className="bg-[#27272a] text-[#a1a1aa] text-[9px]">
                    {p.badge}
                  </Badge>
                </div>

                <p className="text-[11px] text-[#71717a] line-clamp-2 leading-relaxed">
                  {p.desc}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-[#38bdf8] font-medium">
                  <span>1-Click Load</span>
                  <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </Dialog>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATE NEW ONE (AI GUIDED) MODAL */}
      {/* ========================================================================= */}
      {creationModal === 'new' && (
        <Dialog
          isOpen={Boolean(creationModal === 'new')}
          onClose={() => setCreationModal(null)}
          title="Create New Poster & Post"
          description="Powered by Google Vertex AI Nano Banana. Tell us what you're promoting. We'll automatically synthesize your 8K vector poster layout, headline, YouTube caption, and hashtags."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleCreateNewOne} className="space-y-4 pt-1">
            {/* Step 1: Topic */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#fafafa] block">
                What are you promoting? (Topic or Product Name)
              </label>
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="e.g. AI Code Editor Launch, Postgres Vector Teardown, Gaming Headset Review"
                required
                className="bg-[#000000] text-xs"
              />
            </div>

            {/* Step 2: Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#fafafa] block">
                Creator Goal / Deal Type
              </label>
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="e.g. 4K Video Reviews, YouTube Shorts Blitz, Technical Tutorial"
                className="bg-[#000000] text-xs"
              />
            </div>

            {/* Step 3: Color Mood Theme */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#fafafa] block">
                Visual Color Mood
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEME_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTheme(t.id)}
                    className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center space-x-2.5 ${
                      selectedTheme === t.id
                        ? 'border-[#fafafa] bg-[#18181b]'
                        : 'border-[#27272a] bg-[#000000] hover:border-[#3f3f46]'
                    }`}
                  >
                    <div className="flex -space-x-1 shrink-0">
                      <span className="w-3.5 h-3.5 rounded-full border border-[#000]" style={{ backgroundColor: t.a1 }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-[#000]" style={{ backgroundColor: t.a2 }} />
                    </div>
                    <span className="text-[11px] font-medium text-[#fafafa] truncate">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Brand Logo & Product Photos (Up to 2) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#fafafa] flex items-center gap-1.5">
                  <Camera size={13} className="text-[#e11d48]" />
                  Brand Assets & Photos (Optional, up to 2)
                </label>
                <span className="text-[10px] text-[#71717a] font-medium">
                  {uploadedImages.length} / 2 attached
                </span>
              </div>

              <input
                type="file"
                ref={modalLogoInputRef}
                onChange={(e) => handleImageUpload(e, 'logo')}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
              />
              <input
                type="file"
                ref={modalVisualInputRef}
                onChange={(e) => handleImageUpload(e, 'visual')}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-2">
                {/* Slot 1: Logo */}
                <div className="p-2 rounded-lg bg-[#000000] border border-[#27272a] flex items-center justify-between">
                  {brandLogo ? (
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <img src={brandLogo.url} alt="Logo" className="w-7 h-7 rounded object-contain bg-[#18181b] border border-[#3f3f46] shrink-0 p-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium text-[#fafafa] truncate">{brandLogo.name}</p>
                        <p className="text-[9px] text-[#10b981]">Logo attached</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(brandLogo.id)}
                        className="text-[#71717a] hover:text-[#e11d48] p-1 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => modalLogoInputRef.current?.click()}
                      className="w-full py-1.5 px-2 text-center text-[11px] text-[#a1a1aa] hover:text-[#fafafa] flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#18181b] rounded"
                    >
                      <Upload size={12} />
                      <span>+ Brand Logo</span>
                    </button>
                  )}
                </div>

                {/* Slot 2: Product Visual */}
                <div className="p-2 rounded-lg bg-[#000000] border border-[#27272a] flex items-center justify-between">
                  {secondaryVisual ? (
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <img src={secondaryVisual.url} alt="Visual" className="w-7 h-7 rounded object-cover bg-[#18181b] border border-[#3f3f46] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium text-[#fafafa] truncate">{secondaryVisual.name}</p>
                        <p className="text-[9px] text-[#38bdf8]">Photo attached</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(secondaryVisual.id)}
                        className="text-[#71717a] hover:text-[#e11d48] p-1 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => modalVisualInputRef.current?.click()}
                      className="w-full py-1.5 px-2 text-center text-[11px] text-[#a1a1aa] hover:text-[#fafafa] flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#18181b] rounded"
                    >
                      <Camera size={12} />
                      <span>+ Product Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreationModal(null)}
                className="border-[#27272a] text-xs cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={!newTopic.trim() || isGenerating}
                className="space-x-1.5 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs cursor-pointer"
              >
                <Sparkles size={13} />
                <span>{isGenerating ? 'Synthesizing with Nano Banana...' : '🍌 Generate with Nano Banana'}</span>
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* ========================================================================= */}
      {/* 3. SHARE TO YOUTUBE MODAL */}
      {/* ========================================================================= */}
      {isShareModalOpen && (
        <Dialog
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title="Share to YouTube Community"
          description="Copy formatted text and download your poster asset for direct publication in YouTube Studio."
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="p-3 bg-[#18181b] rounded-lg border border-[#27272a] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={graphicAssetUrl}
                  alt="Poster thumbnail"
                  className="w-12 h-12 rounded object-cover border border-[#27272a]"
                />
                <div>
                  <p className="text-xs font-bold text-[#fafafa]">{mainHeading}</p>
                  <p className="text-[11px] text-[#71717a]">8K SVG Resolution Graphic</p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownloadPoster('png')}
                className="space-x-1 cursor-pointer text-xs"
              >
                <Download size={13} />
                <span>Save PNG Image</span>
              </Button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#fafafa]">
                <span className="font-semibold">Formatted Community Post Copy:</span>
                <button
                  onClick={handleCopyFullPost}
                  className="text-[#e11d48] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  {isCopiedPost ? <Check size={12} /> : <Copy size={12} />}
                  <span>{isCopiedPost ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              </div>
              <div className="p-3 bg-[#000000] rounded-lg border border-[#27272a] text-xs text-[#a1a1aa] whitespace-pre-line max-h-40 overflow-y-auto font-sans leading-relaxed">
                {captionText}
                {'\n\n'}
                <span className="text-[#38bdf8]">{hashtags.join(' ')}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] text-[#71717a]">
                Opens YouTube Studio Community post publisher in a new tab.
              </span>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsShareModalOpen(false)}
                  className="border-[#27272a] text-xs cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    handleCopyFullPost();
                    window.open('https://studio.youtube.com/channel/COMMUNITY', '_blank');
                    setIsShareModalOpen(false);
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                  }}
                  className="space-x-1.5 bg-[#e11d48] hover:bg-[#be123c] text-white cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>Copy & Open YouTube Studio</span>
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* ========================================================================= */}
      {/* 4. SAVED POSTS LIBRARY DRAWER */}
      {/* ========================================================================= */}
      {isSavedDrawerOpen && (
        <Dialog
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          title={`Saved Posts Library (${savedPosts.length})`}
          description="Review previously generated campaign posters, captions, and hashtag sets."
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            {savedPosts.length > 0 ? (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {savedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-3 hover:border-[#3f3f46] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-[#fafafa]">{post.title || post.mainHeading}</h4>
                        </div>
                        <p className="text-[11px] text-[#71717a] mt-0.5">
                          Saved on {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveTemplateName(post.title || 'Saved Poster');
                            setBackgroundColor(post.backgroundColor);
                            setAccentColor1(post.accentColor1);
                            setAccentColor2(post.accentColor2);
                            setMainHeading(post.mainHeading);
                            if (post.graphicAssetUrl) setGraphicAssetUrl(post.graphicAssetUrl);
                            setSectionText(post.sectionText);
                            setListHeader(post.listHeader);
                            setRequirementsList(post.requirementsList || []);
                            setCtaText(post.ctaText);
                            setContactInfo(post.contactInfo);
                            setCaptionText(post.captionText);
                            setHashtags(post.hashtags || []);
                            setUploadedImages(post.uploadedImages || []);
                            setIsSavedDrawerOpen(false);
                          }}
                          className="text-xs cursor-pointer"
                        >
                          Load into Canvas
                        </Button>

                        <button
                          onClick={() => setSavedPosts(savedPosts.filter(p => p.id !== post.id))}
                          className="text-[#71717a] hover:text-[#e11d48] p-1.5 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#a1a1aa] line-clamp-2">
                      {post.captionText}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2 bg-[#18181b] rounded-xl border border-[#27272a]">
                <FolderHeart size={24} className="mx-auto text-[#71717a]" />
                <h4 className="text-xs font-semibold text-[#fafafa]">No saved posters yet</h4>
                <p className="text-[11px] text-[#71717a]">
                  Click "Save to Library" on any generated poster to store it here for future campaigns.
                </p>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </div>
  );
}
