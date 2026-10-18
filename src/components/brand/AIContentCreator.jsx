import React, { useState, useRef, useEffect } from 'react';
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
  FileText,
  Video as VideoIcon,
  Layers,
  ArrowRight,
  ArrowLeft,
  Coins,
  Upload,
  Trash2, 
  Plus,
  RefreshCw,
  Eye,
  CheckCircle2,
  ListFilter,
  ExternalLink,
  MessageSquare,
  Clock,
  Search,
  Filter,
  RotateCcw,
  History,
  Camera,
  Layout,
  Lightbulb,
  Zap,
  Tag,
  Sun,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  generateAIPosterArtwork,
  generateYouTubeTextPost
} from '../../packages/ai/geminiClient';
import { uploadGeneratedArtworkToFirebase } from '../../services/storageService';

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

// Preset style improvement directives for artwork redesigns
const REDESIGN_PRESETS = [
  { id: 'photoreal', icon: Camera, label: 'Ultra-Photorealistic', directive: 'ultra-realistic commercial product photography, 8k crisp details, high depth of field' },
  { id: 'minimalist', icon: Layout, label: 'Minimalist Clean Background', directive: 'clean minimalist solid dark studio background, uncluttered aesthetic' },
  { id: 'lighting', icon: Lightbulb, label: 'Dramatic Studio Lighting', directive: 'dramatic volumetric studio lighting with subtle rim lights and soft shadows' },
  { id: 'neon', icon: Zap, label: 'Tech Neon Glow', directive: 'subtle vibrant neon glowing cyber accents, sleek futuristic atmosphere' },
  { id: 'logo', icon: Tag, label: 'Prominent Brand Logo', directive: 'prominently feature the brand logo mark clearly visible in the foreground scene' },
  { id: 'warmer', icon: Sun, label: 'Warm Ambient Lighting', directive: 'warm golden hour ambient lighting, natural tones, soft reflections' },
  { id: 'centered', icon: Target, label: 'Centered Subject Focus', directive: 'centered product composition with strong focal hierarchy and clear framing' }
];

// Initial realistic seed posts so the opening screen is immediately active and informative
const DEFAULT_INITIAL_POSTS = [
  {
    id: 'post_copyy_image_and_text',
    type: 'image_text',
    title: "Sponsor Copyy: Mac's Smartest Clipboard App",
    headline: "SPONSORSHIP OPPORTUNITY: COPYS MAC APP",
    prompt: "Sponsor Copyy: Mac's smartest clipboard app, sleek dark mode macOS workstation, glowing clipboard history & smart paste tools",
    imageUrl: '/creator_collab_poster.jpg',
    aspectRatio: '1:1',
    postText: `**ANNOUNCEMENT: COPYS MAC SPONSORSHIP CALL**\n\nWe are looking for verified YouTube tech creators to showcase Copyy, Mac's smartest clipboard app!\n\n**What We Offer:**\n• $2,500 guaranteed pre-funded escrow payouts\n• Instant API and lifetime license for you and your team\n• Full creative freedom\n\n**Deliverables:**\n• Dedicated 60-90 second integration\n• Authentic demonstration of history & smart paste snippets\n\nCheck the link below to apply today!`,
    hashtags: ['#MacApps', '#CopyyClipboard', '#TechSponsorship', '#DeveloperTools', '#YouTubeCommunity'],
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    brandName: 'Copyy for Mac',
    ctaLink: 'nefra.io/campaigns/copyy'
  },
  {
    id: 'post_copyy_mac_clipboard',
    type: 'image',
    title: "Copyy Visual: Dark Mode Mac Workstation",
    prompt: "Sponsor Copyy: Mac's smartest clipboard app, sleek dark mode macOS workstation, glowing clipboard history & smart paste tools",
    imageUrl: '/creator_collab_poster.jpg',
    aspectRatio: '1:1',
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    brandName: 'Copyy for Mac'
  },
  {
    id: 'post_cursor_ai_sponsorship',
    type: 'text',
    title: 'Cursor AI Tech Sponsorship Initiative',
    headline: 'ANNOUNCEMENT: CALLING ELITE TECH CREATORS',
    postText: `**ANNOUNCEMENT: CALLING ELITE TECH CREATORS**\n\nWe are searching for authentic YouTube creators and developers to test, benchmark, and showcase our latest AI coding release.\n\n**What We Provide:**\n• $1,500 – $4,500 guaranteed 100% pre-funded escrow payout\n• Early alpha access & direct Slack channel with our engineering team\n• Full creative freedom with zero micromanagement\n\n**Deliverables:**\n• 1x Dedicated 4K workflow tutorial\n• 2x High-tempo algorithmic Shorts\n• Companion GitHub repository\n\nDrop your proposal directly through Nefra Escrow Portal to lock your contract slot!`,
    hashtags: ['#YouTubeCreators', '#TechSponsorship', '#DeveloperTools', '#NefraCreators', '#YouTubeCommunity'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    brandName: 'Cursor AI / Anysphere',
    ctaLink: 'nefra.io/campaigns/cursor'
  }
];

export function AIContentCreator({
  currentUser,
  userProfile,
  campaigns = [],
  activeCreator,
  brandCredits = 250,
  onDeductBrandCredits,
  onOpenTopup
}) {
  // Navigation viewMode: 'list' (Opening screen) | 'wizard' (Guided creation) | 'post_detail' (Final review & sharing)
  const [viewMode, setViewMode] = useState('list');

  // Posts State (Persisted in localStorage)
  const [createdPosts, setCreatedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('nefra_created_social_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_INITIAL_POSTS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nefra_created_social_posts', JSON.stringify(createdPosts));
    } catch (e) {}
  }, [createdPosts]);

  // Active post selected for viewing in 'post_detail'
  const [activePost, setActivePost] = useState(null);

  // Filter & Search on opening screen
  const [filterType, setFilterType] = useState('all'); // 'all' | 'image' | 'text' | 'image_text'
  const [searchQuery, setSearchQuery] = useState('');

  // Guided Wizard State
  const [wizardStep, setWizardStep] = useState(1); // 1: Output Format, 2: Brand Assets, 3: Requirements & Prompt, 4: Generating
  const [wizardFormat, setWizardFormat] = useState('image_text'); // 'text' | 'image' | 'image_text'
  const [wizardTopic, setWizardTopic] = useState('');
  const [wizardRequirement, setWizardRequirement] = useState('');
  const [wizardTone, setWizardTone] = useState('Exciting Launch');
  const [wizardCtaLink, setWizardCtaLink] = useState('nefra.io/sponsorship');
  const [wizardAspectRatio, setWizardAspectRatio] = useState('1:1'); // '1:1' | '16:9' | '9:16'
  const [wizardMood, setWizardMood] = useState('Dark Tech Glow');

  const DEFAULT_BRAND_LOGO = {
    id: 'default_nefra_logo',
    name: 'LOGO.png',
    url: '/LOGO.png',
    role: 'logo'
  };

  // Reference assets (Logo and Product/Visual Screenshot)
  const [uploadedLogo, setUploadedLogo] = useState(DEFAULT_BRAND_LOGO);
  const [uploadedVisual, setUploadedVisual] = useState(null);
  const logoInputRef = useRef(null);
  const visualInputRef = useRef(null);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTargetPost, setShareTargetPost] = useState(null);

  // Redesign Request State
  const [isRedesignModalOpen, setIsRedesignModalOpen] = useState(false);
  const [redesignTargetPost, setRedesignTargetPost] = useState(null);
  const [redesignFeedback, setRedesignFeedback] = useState('');
  const [redesignAspectRatio, setRedesignAspectRatio] = useState('1:1');
  const [redesignSelectedTags, setRedesignSelectedTags] = useState([]);
  const [isRedesigning, setIsRedesigning] = useState(false);

  // Edit in-place on post detail
  const [detailEditText, setDetailEditText] = useState('');

  // Filtered posts for opening screen
  const filteredPosts = createdPosts.filter((post) => {
    const matchesType = filterType === 'all' || post.type === filterType;
    const matchesSearch = !searchQuery.trim() || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.postText?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const imagePostsCount = createdPosts.filter(p => p.type === 'image').length;
  const textPostsCount = createdPosts.filter(p => p.type === 'text').length;
  const imageTextPostsCount = createdPosts.filter(p => p.type === 'image_text').length;

  // Open Wizard
  const handleStartWizard = () => {
    setWizardStep(1);
    setWizardFormat('image_text');
    setWizardTopic('');
    setWizardRequirement('');
    setWizardTone('Exciting Launch');
    setWizardCtaLink(userProfile?.companyName ? `nefra.io/campaigns/${userProfile.companyName.toLowerCase().replace(/[^a-z]/g, '')}` : 'nefra.io/sponsorship');
    setWizardAspectRatio('1:1');
    setWizardMood('Dark Tech Glow');
    setUploadedLogo(DEFAULT_BRAND_LOGO);
    setViewMode('wizard');
  };

  // Image Upload Handlers
  const handleFileUpload = (e, slotRole) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Image exceeds 8MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const item = {
        id: `img_${Date.now()}`,
        name: file.name,
        url: event.target.result,
        role: slotRole
      };
      if (slotRole === 'logo') {
        setUploadedLogo(item);
      } else {
        setUploadedVisual(item);
      }
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.6 } });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleLoadDemoLogo = () => {
    setUploadedLogo(DEFAULT_BRAND_LOGO);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
  };

  // Open Redesign Request Modal
  const handleOpenRedesignModal = (post) => {
    if (!post) return;
    setRedesignTargetPost(post);
    setRedesignFeedback('');
    setRedesignAspectRatio(post.aspectRatio || '1:1');
    setRedesignSelectedTags([]);
    setIsRedesignModalOpen(true);
  };

  const handleToggleRedesignTag = (presetId) => {
    setRedesignSelectedTags(prev => 
      prev.includes(presetId) ? prev.filter(id => id !== presetId) : [...prev, presetId]
    );
  };

  const handleSubmitRedesign = async () => {
    if (!redesignTargetPost) return;

    if (typeof brandCredits === 'number' && brandCredits < 20) {
      if (onOpenTopup) onOpenTopup();
      else alert('Insufficient Brand Credits. You need at least 20 Brand Credits for an AI redesign.');
      return;
    }

    setIsRedesigning(true);
    try {
      if (onDeductBrandCredits) {
        onDeductBrandCredits(20, `AI Content Creator - Redesign Artwork`);
      }

      // Collect preset prompt additions
      const selectedAdditions = REDESIGN_PRESETS
        .filter(preset => redesignSelectedTags.includes(preset.id))
        .map(preset => preset.directive)
        .join(', ');

      const revisionDirectives = [
        redesignFeedback.trim(),
        selectedAdditions
      ].filter(Boolean).join('. ');

      const revisedPrompt = `${redesignTargetPost.title}: ${redesignTargetPost.prompt}. SPECIFIC REDESIGN DIRECTIVES: ${revisionDirectives || 'Refine composition, sharpen lighting, and enhance visual aesthetics'}`;

      const refImages = redesignTargetPost.uploadedImages && redesignTargetPost.uploadedImages.length > 0
        ? redesignTargetPost.uploadedImages
        : (uploadedLogo ? [uploadedLogo] : []);

      const newImageUrl = await generateAIPosterArtwork({
        topic: redesignTargetPost.title,
        graphicDescription: revisedPrompt,
        aspectRatio: redesignAspectRatio,
        referenceImages: refImages
      });

      // Save redesigned image into Firebase Storage bucket
      let persistentImageUrl = newImageUrl;
      if (newImageUrl && newImageUrl.startsWith('data:')) {
        try {
          persistentImageUrl = await uploadGeneratedArtworkToFirebase({
            dataUrl: newImageUrl,
            filename: `redesign_${Date.now()}.png`,
            brandName: userProfile?.companyName || redesignTargetPost.brandName || 'brand'
          });
        } catch (e) {
          console.warn('[Firebase Storage] Failed to persist redesigned artwork:', e.message);
        }
      }

      const previousVersions = redesignTargetPost.revisions || [];
      const updatedPost = {
        ...redesignTargetPost,
        imageUrl: persistentImageUrl || redesignTargetPost.imageUrl,
        aspectRatio: redesignAspectRatio,
        prompt: revisedPrompt,
        revisions: [
          {
            imageUrl: redesignTargetPost.imageUrl,
            prompt: redesignTargetPost.prompt,
            timestamp: new Date().toISOString()
          },
          ...previousVersions
        ],
        updatedAt: new Date().toISOString()
      };

      setCreatedPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
      setActivePost(updatedPost);
      setIsRedesignModalOpen(false);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Redesign error:', err);
      alert('Redesign request failed: ' + err.message);
    } finally {
      setIsRedesigning(false);
    }
  };

  const handleRevertRevision = (revision) => {
    if (!activePost) return;
    const updatedPost = {
      ...activePost,
      imageUrl: revision.imageUrl,
      prompt: revision.prompt,
      updatedAt: new Date().toISOString()
    };
    setCreatedPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    setActivePost(updatedPost);
  };

  const handleEditInWizard = (post) => {
    setWizardStep(3);
    setWizardFormat(post.type);
    setWizardTopic(post.title || '');
    setWizardRequirement(post.prompt || '');
    setWizardAspectRatio(post.aspectRatio || '1:1');
    if (post.uploadedImages && post.uploadedImages.length > 0) {
      const logoItem = post.uploadedImages.find(img => img.role === 'logo');
      const visualItem = post.uploadedImages.find(img => img.role === 'visual');
      if (logoItem) setUploadedLogo(logoItem);
      if (visualItem) setUploadedVisual(visualItem);
    }
    setIsRedesignModalOpen(false);
    setViewMode('wizard');
  };

  // Execute AI Generation
  const handleExecuteGeneration = async () => {
    if (!wizardTopic.trim()) {
      alert('Please enter what you are promoting.');
      return;
    }

    if (typeof brandCredits === 'number' && brandCredits < 20) {
      if (onOpenTopup) onOpenTopup();
      else alert('Insufficient Brand Credits. You need at least 20 Brand Credits.');
      return;
    }

    setIsGenerating(true);
    setWizardStep(4);

    try {
      if (onDeductBrandCredits) {
        onDeductBrandCredits(20, `AI Content Creator - ${wizardFormat === 'image_text' ? 'Image + Text' : wizardFormat === 'image' ? 'Nano Banana Image' : 'Gemini Text Post'}`);
      }

      const brandTitle = userProfile?.companyName || 'My Brand';
      const refImages = [];
      if (uploadedLogo) refImages.push(uploadedLogo);
      if (uploadedVisual) refImages.push(uploadedVisual);

      if (wizardFormat === 'image_text') {
        // Complete Image + Text Package: Run image generation and text post generation in parallel
        const promptToSynthesize = `${wizardTopic.trim()}: ${wizardRequirement.trim() || 'High-impact standalone product showcase, sleek modern lighting, tech workspace aesthetic'}`;
        
        const [generatedArtUrl, textResult] = await Promise.all([
          generateAIPosterArtwork({
            topic: wizardTopic.trim(),
            graphicDescription: promptToSynthesize,
            aspectRatio: wizardAspectRatio,
            referenceImages: refImages
          }),
          generateYouTubeTextPost({
            topic: wizardTopic.trim(),
            brandName: brandTitle,
            requirements: wizardRequirement.trim(),
            tone: wizardTone,
            ctaLink: wizardCtaLink
          })
        ]);

        // Persist generated image to Firebase Storage bucket
        let persistentImageUrl = generatedArtUrl;
        if (generatedArtUrl && generatedArtUrl.startsWith('data:')) {
          try {
            persistentImageUrl = await uploadGeneratedArtworkToFirebase({
              dataUrl: generatedArtUrl,
              filename: `nefra_${Date.now()}.png`,
              brandName: brandTitle
            });
          } catch (e) {
            console.warn('[Firebase Storage] Failed to persist artwork:', e.message);
          }
        }

        const newPost = {
          id: `post_${Date.now()}`,
          type: 'image_text',
          title: wizardTopic.trim(),
          headline: textResult.headline || wizardTopic.trim().toUpperCase(),
          prompt: wizardRequirement.trim() || promptToSynthesize,
          imageUrl: persistentImageUrl || '/creator_collab_poster.jpg',
          aspectRatio: wizardAspectRatio,
          postText: textResult.postText,
          hashtags: textResult.hashtags,
          createdAt: new Date().toISOString(),
          brandName: brandTitle,
          ctaLink: wizardCtaLink,
          uploadedImages: refImages
        };

        setCreatedPosts(prev => [newPost, ...prev]);
        setActivePost(newPost);
        setDetailEditText(newPost.postText);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        setViewMode('post_detail');

      } else if (wizardFormat === 'image') {
        // Synthesize standalone image with Google Vertex AI Nano Banana
        const promptToSynthesize = `${wizardTopic.trim()}: ${wizardRequirement.trim() || 'High-impact standalone product showcase, sleek modern lighting, tech workspace aesthetic'}`;
        const generatedArtUrl = await generateAIPosterArtwork({
          topic: wizardTopic.trim(),
          graphicDescription: promptToSynthesize,
          aspectRatio: wizardAspectRatio,
          referenceImages: refImages
        });

        // Persist generated image to Firebase Storage bucket
        let persistentImageUrl = generatedArtUrl;
        if (generatedArtUrl && generatedArtUrl.startsWith('data:')) {
          try {
            persistentImageUrl = await uploadGeneratedArtworkToFirebase({
              dataUrl: generatedArtUrl,
              filename: `nefra_${Date.now()}.png`,
              brandName: brandTitle
            });
          } catch (e) {
            console.warn('[Firebase Storage] Failed to persist artwork:', e.message);
          }
        }

        const newPost = {
          id: `post_${Date.now()}`,
          type: 'image',
          title: wizardTopic.trim(),
          prompt: wizardRequirement.trim() || promptToSynthesize,
          imageUrl: persistentImageUrl || '/creator_collab_poster.jpg',
          aspectRatio: wizardAspectRatio,
          createdAt: new Date().toISOString(),
          brandName: brandTitle,
          uploadedImages: refImages
        };

        setCreatedPosts(prev => [newPost, ...prev]);
        setActivePost(newPost);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        setViewMode('post_detail');

      } else {
        // Synthesize YouTube Community Text Post with Google Vertex AI Gemini
        const textResult = await generateYouTubeTextPost({
          topic: wizardTopic.trim(),
          brandName: brandTitle,
          requirements: wizardRequirement.trim(),
          tone: wizardTone,
          ctaLink: wizardCtaLink
        });

        const newPost = {
          id: `post_${Date.now()}`,
          type: 'text',
          title: textResult.title || wizardTopic.trim(),
          headline: textResult.headline || wizardTopic.trim().toUpperCase(),
          postText: textResult.postText,
          hashtags: textResult.hashtags,
          createdAt: new Date().toISOString(),
          brandName: brandTitle,
          ctaLink: wizardCtaLink
        };

        setCreatedPosts(prev => [newPost, ...prev]);
        setActivePost(newPost);
        setDetailEditText(newPost.postText);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        setViewMode('post_detail');
      }
    } catch (err) {
      console.error('Generation error:', err);
      alert('Generation encountered an issue: ' + err.message);
      setWizardStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  // Open a post in detail view
  const handleOpenPostDetail = (post) => {
    setActivePost(post);
    if (post.type === 'text' || post.type === 'image_text') {
      setDetailEditText(post.postText || '');
    }
    setViewMode('post_detail');
  };

  // Delete Post
  const handleDeletePost = (postId, e) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this created post?')) {
      setCreatedPosts(prev => prev.filter(p => p.id !== postId));
      if (activePost?.id === postId) {
        setViewMode('list');
        setActivePost(null);
      }
    }
  };

  // Copy text helper
  const handleCopyText = (text, id = null) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Download image helper
  const handleDownloadImage = (post, format = 'png') => {
    if (!post?.imageUrl) return;
    const baseName = post.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'youtube_post';
    const ext = format === 'jpg' || format === 'jpeg' ? 'jpg' : 'png';
    const fileName = `${baseName}_nano_banana.${ext}`;

    if (post.imageUrl.startsWith('data:image/')) {
      const link = document.createElement('a');
      link.href = post.imageUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    fetch(post.imageUrl)
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
        link.href = post.imageUrl;
        link.target = '_blank';
        link.download = fileName;
        link.click();
      });
  };

  // Open YouTube Share Modal
  const handleShareToYouTube = (post, e) => {
    if (e) e.stopPropagation();
    setShareTargetPost(post);
    setIsShareModalOpen(true);
  };

  // =========================================================================
  // VIEW 1: OPENING SCREEN (SHOWS CREATED POSTS SO FAR + CREATE BUTTON)
  // =========================================================================
  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {/* Top Header */}
        <div className="border-b border-[#27272a] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-[#fafafa] flex items-center gap-2">
                <Wand2 className="text-[#e11d48]" size={22} />
                AI Content Creator
              </h1>
              <Badge variant="action" className="text-[10px] bg-[#e11d48]/15 border-[#e11d48]/30 text-[#e11d48]">
                YouTube Community
              </Badge>
              <Badge className="text-[10px] bg-yellow-500/10 border-yellow-500/30 text-yellow-400 font-semibold flex items-center gap-1">
                <Sparkles size={11} className="text-yellow-400" />
                <span>Vertex AI Nano Banana</span>
              </Badge>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-0.5">
              Manage your created YouTube Community posts, or synthesize fresh images and high-converting copy with Google AI.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Brand Credits Counter */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs">
              <Coins size={14} className="text-[#3b82f6]" />
              <span className="font-semibold text-white tabular-nums">{brandCredits}</span>
              <span className="text-[#71717a] hidden sm:inline">Credits Remaining</span>
              {onOpenTopup && (
                <button 
                  onClick={onOpenTopup}
                  title="Top-up Brand Credits"
                  className="ml-1 text-[11px] text-[#3b82f6] hover:underline font-semibold cursor-pointer"
                >
                  + Top-up
                </button>
              )}
            </div>

            {/* Primary Action Button: Create New Post */}
            <Button
              size="sm"
              onClick={handleStartWizard}
              className="space-x-1.5 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-semibold cursor-pointer px-4 shadow-lg shadow-[#e11d48]/20"
            >
              <Plus size={15} />
              <span>Create New Post</span>
            </Button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 bg-[#09090b] p-1 rounded-lg border border-[#27272a] w-full sm:w-auto flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#18181b] text-white shadow-sm'
                  : 'text-[#71717a] hover:text-[#fafafa]'
              }`}
            >
              All Posts ({createdPosts.length})
            </button>
            <button
              onClick={() => setFilterType('image_text')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                filterType === 'image_text'
                  ? 'bg-[#18181b] text-[#10b981] shadow-sm'
                  : 'text-[#71717a] hover:text-[#fafafa]'
              }`}
            >
              <Layers size={12} />
              <span>Image + Text ({imageTextPostsCount})</span>
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                filterType === 'image'
                  ? 'bg-[#18181b] text-yellow-400 shadow-sm'
                  : 'text-[#71717a] hover:text-[#fafafa]'
              }`}
            >
              <ImageIcon size={12} />
              <span>Image Only ({imagePostsCount})</span>
            </button>
            <button
              onClick={() => setFilterType('text')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                filterType === 'text'
                  ? 'bg-[#18181b] text-[#38bdf8] shadow-sm'
                  : 'text-[#71717a] hover:text-[#fafafa]'
              }`}
            >
              <FileText size={12} />
              <span>Text Only ({textPostsCount})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={13} className="absolute left-2.5 top-2.5 text-[#71717a]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search created posts..."
              className="pl-8 bg-[#09090b] text-xs h-8 border-[#27272a]"
            />
          </div>
        </div>

        {/* Created Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => {
              const isImageOnly = post.type === 'image';
              const isImageText = post.type === 'image_text';
              const hasImage = Boolean(post.imageUrl);

              return (
                <Card
                  key={post.id}
                  onClick={() => handleOpenPostDetail(post)}
                  className="bg-[#0e0e11] border-[#27272a] hover:border-[#3f3f46] transition-all p-4 flex flex-col justify-between space-y-3 cursor-pointer group hover:shadow-xl"
                >
                  {/* Card Header & Badge */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border ${
                        isImageText
                          ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                          : isImageOnly 
                          ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
                          : 'bg-[#3b82f6]/10 border-[#3b82f6]/30 text-[#38bdf8]'
                      }`}>
                        {isImageText ? <Layers size={11} /> : isImageOnly ? <ImageIcon size={11} /> : <FileText size={11} />}
                        <span>
                          {isImageText 
                            ? 'Image + Text (Nano Banana + Gemini)' 
                            : isImageOnly 
                            ? 'Image Only (Nano Banana)' 
                            : 'Text Only (Gemini)'}
                        </span>
                      </span>

                      <div className="flex items-center space-x-1 text-[#71717a] text-[10px]">
                        <Clock size={11} />
                        <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-[#fafafa] group-hover:text-white transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                  </div>

                  {/* Card Visual / Excerpt Preview */}
                  {isImageText ? (
                    <div className="space-y-2">
                      <div className="relative rounded-lg overflow-hidden border border-[#27272a] bg-[#070709] aspect-video flex items-center justify-center">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                          <span className="text-[10px] text-white font-medium flex items-center gap-1">
                            <Eye size={12} />
                            <span>View Image & Text</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#a1a1aa] line-clamp-2 leading-relaxed">
                        {post.postText}
                      </p>
                    </div>
                  ) : isImageOnly ? (
                    <div className="relative rounded-lg overflow-hidden border border-[#27272a] bg-[#070709] aspect-square flex items-center justify-center">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                        <span className="text-[11px] text-white font-medium flex items-center gap-1">
                          <Eye size={12} />
                          <span>Click to View & Download</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-[#070709] border border-[#27272a] text-xs text-[#a1a1aa] space-y-2 h-44 overflow-hidden relative">
                      <p className="text-[11px] font-bold text-[#fafafa] line-clamp-1">
                        {post.headline || post.title}
                      </p>
                      <p className="text-[11px] text-[#d4d4d8] leading-relaxed line-clamp-4 whitespace-pre-line">
                        {post.postText}
                      </p>
                      {post.hashtags && (
                        <p className="text-[10px] text-[#38bdf8] font-medium line-clamp-1">
                          {post.hashtags.join(' ')}
                        </p>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#070709] to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Card Footer Actions */}
                  <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#71717a] font-medium">
                      {isImageOnly ? `${post.aspectRatio || '1:1'} Format` : isImageText ? 'Image + Text Bundle' : 'YouTube Post Ready'}
                    </span>

                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      {hasImage && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenRedesignModal(post)}
                            title="Request AI Redesign with Nano Banana"
                            className="p-1.5 rounded hover:bg-[#18181b] text-yellow-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <RotateCcw size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadImage(post, 'png')}
                            title="Download Image (PNG)"
                            className="p-1.5 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer"
                          >
                            <Download size={13} />
                          </button>
                        </>
                      )}

                      {post.postText && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(`${post.postText}\n\n${(post.hashtags || []).join(' ')}`, post.id)}
                          title="Copy Post Copy"
                          className="p-1.5 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer"
                        >
                          {copiedId === post.id ? <Check size={13} className="text-[#10b981]" /> : <Copy size={13} />}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleShareToYouTube(post, e)}
                        title="Share on YouTube"
                        className="p-1.5 rounded hover:bg-[#18181b] text-[#e11d48] hover:text-white transition-colors cursor-pointer"
                      >
                        <Share2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeletePost(post.id, e)}
                        title="Delete Post"
                        className="p-1.5 rounded hover:bg-[#18181b] text-[#71717a] hover:text-[#e11d48] transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <Card className="p-12 text-center bg-[#0e0e11] border-[#27272a] space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#18181b] border border-[#27272a] mx-auto flex items-center justify-center text-[#e11d48]">
              <Wand2 size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#fafafa]">No Created Posts Found</h3>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
                {searchQuery 
                  ? 'No posts matched your search criteria. Try a different query.'
                  : 'Synthesize your first YouTube Community post or standalone image with Google Vertex AI.'}
              </p>
            </div>
            <Button
              onClick={handleStartWizard}
              className="bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-semibold space-x-1.5 cursor-pointer mx-auto"
            >
              <Plus size={14} />
              <span>Create First Post</span>
            </Button>
          </Card>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: GUIDED CREATION WIZARD (STEP-BY-STEP SIMPLE QUESTIONS)
  // =========================================================================
  if (viewMode === 'wizard') {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Wizard Header Bar */}
        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="text-xs text-[#a1a1aa] hover:text-white flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <ArrowLeft size={14} />
            <span>Back to Created Posts</span>
          </button>

          {/* Step Pill Indicators */}
          <div className="flex items-center space-x-2 text-xs">
            {[
              { num: 1, label: 'Format' },
              { num: 2, label: 'Assets' },
              { num: 3, label: 'Questions' },
              { num: 4, label: 'Synthesis' }
            ].map((s) => (
              <div 
                key={s.num}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  wizardStep === s.num
                    ? 'bg-[#e11d48]/15 border-[#e11d48]/40 text-[#e11d48]'
                    : wizardStep > s.num
                    ? 'bg-[#10b981]/15 border-[#10b981]/30 text-[#10b981]'
                    : 'bg-[#141417] border-[#27272a] text-[#71717a]'
                }`}
              >
                <span>{wizardStep > s.num ? <Check size={11} className="inline" /> : s.num}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="text-xs text-[#71717a] font-medium">
            20 Brand Credits
          </div>
        </div>

        {/* STEP 1: CHOOSE OUTPUT FORMAT */}
        {wizardStep === 1 && (
          <Card className="p-6 bg-[#0e0e11] border-[#27272a] space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#fafafa] flex items-center gap-2">
                <span>1. What kind of YouTube post do you want?</span>
              </h2>
              <p className="text-xs text-[#a1a1aa]">
                Select your output type. We support standalone AI images, viral Community text posts, or a complete image + text bundle.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Image + Text (Allowed!) */}
              <div
                onClick={() => setWizardFormat('image_text')}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 relative ${
                  wizardFormat === 'image_text'
                    ? 'bg-[#18181b] border-[#10b981] ring-1 ring-[#10b981]/40 shadow-lg'
                    : 'bg-[#121215] border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#10b981]/10 text-[#10b981]">
                    <Layers size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 flex items-center gap-1">
                    <Layers size={11} />
                    <span>Nano Banana + Gemini</span>
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#fafafa]">Image + Text</h3>
                  <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                    Complete YouTube Community package: generates both a standalone AI image and tailored community copy & viral hashtags.
                  </p>
                </div>
              </div>

              {/* Option 2: Image Only (Allowed) */}
              <div
                onClick={() => setWizardFormat('image')}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 relative ${
                  wizardFormat === 'image'
                    ? 'bg-[#18181b] border-yellow-400 ring-1 ring-yellow-400/40 shadow-lg'
                    : 'bg-[#121215] border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400">
                    <ImageIcon size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-400/15 text-yellow-400 border border-yellow-400/30 flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>Nano Banana</span>
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#fafafa]">Image Only</h3>
                  <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                    Pure AI promotional visual generated by Google Vertex AI Nano Banana referencing your logo and product screenshot.
                  </p>
                </div>
              </div>

              {/* Option 3: Text Only (Allowed) */}
              <div
                onClick={() => setWizardFormat('text')}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 relative ${
                  wizardFormat === 'text'
                    ? 'bg-[#18181b] border-[#38bdf8] ring-1 ring-[#38bdf8]/40 shadow-lg'
                    : 'bg-[#121215] border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8]">
                    <FileText size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 flex items-center gap-1">
                    <Zap size={11} />
                    <span>Gemini 2.5 Flash</span>
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#fafafa]">Text only ("Text post with hashtags")</h3>
                  <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                    High-converting YouTube Community post with hook, clear value points, call to action, and viral hashtags.
                  </p>
                </div>
              </div>

              {/* Option 4: Video (Disabled / Coming Soon) */}
              <div className="p-4 rounded-xl border border-[#27272a] bg-[#09090b]/60 opacity-60 space-y-2.5 cursor-not-allowed relative">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#27272a] text-[#71717a]">
                    <VideoIcon size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#27272a] text-[#a1a1aa]">
                    Coming Soon
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#71717a]">Video</h3>
                  <p className="text-xs text-[#71717a] mt-1">
                    Automated YouTube Shorts video clips and motion announcements for video tab publishing.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3">
              <Button
                onClick={() => setWizardStep(2)}
                className="bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-semibold space-x-1.5 cursor-pointer px-5"
              >
                <span>Continue to Brand Assets</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: BRAND ASSETS (LOGO & REFERENCE PHOTO) */}
        {wizardStep === 2 && (
          <Card className="p-6 bg-[#0e0e11] border-[#27272a] space-y-6">
            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={logoInputRef}
              onChange={(e) => handleFileUpload(e, 'logo')}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
            />
            <input
              type="file"
              ref={visualInputRef}
              onChange={(e) => handleFileUpload(e, 'visual')}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
            />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#fafafa]">2. Provide Brand Visual References</h2>
                <p className="text-xs text-[#a1a1aa]">
                  Upload your brand logo and product photo or screenshot. The Google AI model will refer directly to them.
                </p>
              </div>

              {!uploadedLogo && (
                <button
                  type="button"
                  onClick={handleLoadDemoLogo}
                  className="text-xs text-[#38bdf8] hover:underline cursor-pointer font-medium flex items-center gap-1"
                >
                  <Zap size={12} className="text-yellow-400" />
                  <span>Load Demo Logo</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Slot 1: Logo */}
              <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#fafafa] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#e11d48]" />
                    Reference 1: Brand Logo
                  </span>
                  <span className="text-[10px] text-[#71717a]">Optional</span>
                </div>

                {uploadedLogo ? (
                  <div className="p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img src={uploadedLogo.url} alt="Logo" className="w-10 h-10 rounded object-contain bg-[#18181b] p-1 border border-[#3f3f46]" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{uploadedLogo.name}</p>
                        <p className="text-[10px] text-[#10b981]">Active Reference</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="p-1 text-[#a1a1aa] hover:text-white cursor-pointer"
                        title="Replace"
                      >
                        <RefreshCw size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadedLogo(null)}
                        className="p-1 text-[#71717a] hover:text-red-400 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full py-6 border border-dashed border-[#3f3f46] hover:border-white rounded-lg bg-[#09090b]/60 flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-all"
                  >
                    <Upload size={18} className="text-[#a1a1aa]" />
                    <span className="text-xs font-semibold text-white">Upload Brand Logo</span>
                    <span className="text-[10px] text-[#71717a]">PNG / SVG transparent</span>
                  </button>
                )}
              </div>

              {/* Slot 2: Product Visual */}
              <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#fafafa] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                    Reference 2: Product Visual / Screenshot
                  </span>
                  <span className="text-[10px] text-[#71717a]">Optional</span>
                </div>

                {uploadedVisual ? (
                  <div className="p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img src={uploadedVisual.url} alt="Product visual" className="w-10 h-10 rounded object-cover border border-[#3f3f46]" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{uploadedVisual.name}</p>
                        <p className="text-[10px] text-[#38bdf8]">Active Reference</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => visualInputRef.current?.click()}
                        className="p-1 text-[#a1a1aa] hover:text-white cursor-pointer"
                        title="Replace"
                      >
                        <RefreshCw size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadedVisual(null)}
                        className="p-1 text-[#71717a] hover:text-red-400 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => visualInputRef.current?.click()}
                    className="w-full py-6 border border-dashed border-[#3f3f46] hover:border-white rounded-lg bg-[#09090b]/60 flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-all"
                  >
                    <Upload size={18} className="text-[#a1a1aa]" />
                    <span className="text-xs font-semibold text-white">Upload Product Photo</span>
                    <span className="text-[10px] text-[#71717a]">PNG / JPG screenshot</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <Button
                variant="outline"
                onClick={() => setWizardStep(1)}
                className="border-[#27272a] text-xs cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </Button>

              <Button
                onClick={() => setWizardStep(3)}
                className="bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-semibold space-x-1.5 cursor-pointer px-5"
              >
                <span>Continue to Questions</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: REQUIREMENTS & SIMPLE QUESTIONS */}
        {wizardStep === 3 && (
          <Card className="p-6 bg-[#0e0e11] border-[#27272a] space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#fafafa]">3. Campaign Requirements</h2>
              <p className="text-xs text-[#a1a1aa]">
                Answer a few quick questions so the AI understands what to synthesize.
              </p>
            </div>

            <div className="space-y-4">
              {/* Question 1: What are you promoting? */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#fafafa] block">
                  Question 1: What are you promoting? (Product or Campaign Name) *
                </label>
                <Input
                  value={wizardTopic}
                  onChange={(e) => setWizardTopic(e.target.value)}
                  placeholder="e.g. Copyy: Mac Smartest Clipboard App"
                  required
                  className="bg-[#000000] text-xs"
                />
              </div>

              {/* Question 2: Specific Requirements / Key Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#fafafa] block">
                  Question 2: What is your key requirement or message? *
                </label>
                <Textarea
                  rows={3}
                  value={wizardRequirement}
                  onChange={(e) => setWizardRequirement(e.target.value)}
                  placeholder={
                    wizardFormat === 'text'
                      ? "e.g. Sponsoring tech YouTubers for 4K video reviews, guaranteed escrow payouts, and early developer tooling alpha access."
                      : "e.g. Sleek futuristic macOS developer workspace, clipboard history preview, glowing neon accents, and smart paste tools."
                  }
                  className="bg-[#000000] text-xs"
                />
              </div>

              {/* Branching based on format */}
              {(wizardFormat === 'image' || wizardFormat === 'image_text') && (
                /* Image settings */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#fafafa] block">
                      Canvas Aspect Ratio (for Image):
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: '1:1', label: '1:1 Community' },
                        { id: '16:9', label: '16:9 Video' },
                        { id: '9:16', label: '9:16 Shorts' }
                      ].map(fmt => (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => setWizardAspectRatio(fmt.id)}
                          className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                            wizardAspectRatio === fmt.id
                              ? 'bg-yellow-400/15 border-yellow-400 text-yellow-300'
                              : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]'
                          }`}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#fafafa] block">
                      Visual Mood Theme:
                    </label>
                    <select
                      value={wizardMood}
                      onChange={(e) => setWizardMood(e.target.value)}
                      className="w-full h-9 rounded-lg bg-[#000000] border border-[#27272a] text-xs text-white px-2.5 focus:border-[#fafafa] outline-none"
                    >
                      <option value="Dark Tech Glow">Dark Tech Glow (Cyan & Red)</option>
                      <option value="Clean Minimal SaaS">Clean Minimal SaaS (Monochrome & Blue)</option>
                      <option value="Cyberpunk Workstation">Cyberpunk Workstation (Purple & Emerald)</option>
                      <option value="Bold Product Showcase">Bold Product Showcase (High Contrast)</option>
                    </select>
                  </div>
                </div>
              )}

              {(wizardFormat === 'text' || wizardFormat === 'image_text') && (
                /* Text post settings */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#fafafa] block">
                      Tone of Voice (for Copy):
                    </label>
                    <select
                      value={wizardTone}
                      onChange={(e) => setWizardTone(e.target.value)}
                      className="w-full h-9 rounded-lg bg-[#000000] border border-[#27272a] text-xs text-white px-2.5 focus:border-[#fafafa] outline-none"
                    >
                      <option value="Exciting Launch">Exciting Launch Announcement</option>
                      <option value="Creator Sponsorship Call">Creator Sponsorship & Collab</option>
                      <option value="Professional & Direct">Professional & Direct</option>
                      <option value="Casual & High Energy">Casual & High Energy</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#fafafa] block">
                      Destination / Call-to-Action Link:
                    </label>
                    <Input
                      value={wizardCtaLink}
                      onChange={(e) => setWizardCtaLink(e.target.value)}
                      placeholder="e.g. nefra.io/campaigns/copyy"
                      className="bg-[#000000] text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#27272a]">
              <Button
                variant="outline"
                onClick={() => setWizardStep(2)}
                className="border-[#27272a] text-xs cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </Button>

              <Button
                disabled={!wizardTopic.trim() || isGenerating}
                onClick={handleExecuteGeneration}
                className="bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold space-x-1.5 cursor-pointer px-6 shadow-lg shadow-[#e11d48]/25"
                title={`Synthesize Post (20 Credits • ${brandCredits} remaining)`}
              >
                <Sparkles size={14} />
                <span>Synthesize Post with Google AI (20 Credits • {brandCredits} remaining)</span>
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: LIVE SYNTHESIS PROGRESS */}
        {wizardStep === 4 && (
          <Card className="p-12 text-center bg-[#0e0e11] border-[#27272a] space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={28} className="text-yellow-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-base font-bold text-white">
                {wizardFormat === 'image_text'
                  ? 'Google Vertex AI Nano Banana & Gemini are Synthesizing...'
                  : wizardFormat === 'image' 
                  ? 'Google Vertex AI Nano Banana is Generating Your Image...' 
                  : 'Google Vertex AI Gemini is Crafting Your Community Post...'}
              </h3>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                {wizardFormat === 'image_text'
                  ? `Fusing your reference assets into a standalone image with Nano Banana while generating formatted YouTube Community text and hashtags with Gemini 2.5 Flash.`
                  : wizardFormat === 'image'
                  ? `Analyzing your uploaded assets (${(uploadedLogo ? 1 : 0) + (uploadedVisual ? 1 : 0)} attached) and requirements to generate a high-resolution, standalone image.`
                  : `Structuring your headline, value points, deliverables, call to action, and discovery hashtags for YouTube Community.`}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-[11px] text-[#71717a]">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span>
                {wizardFormat === 'image_text' 
                  ? 'Models: gemini-2.5-flash-image (Nano Banana) + gemini-2.5-flash' 
                  : wizardFormat === 'image' 
                  ? 'Model: gemini-2.5-flash-image (Nano Banana)' 
                  : 'Model: gemini-2.5-flash'}
              </span>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: FINAL STAGE (POST DETAIL, SHARE ON YOUTUBE, SAVE & DOWNLOAD)
  // =========================================================================
  if (viewMode === 'post_detail' && activePost) {
    const isImageOnly = activePost.type === 'image';
    const isImageText = activePost.type === 'image_text';
    const isTextOnly = activePost.type === 'text';
    const hasImage = Boolean(activePost.imageUrl);
    const hasText = Boolean(activePost.postText);

    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Navigation & Status Bar */}
        <div className="flex items-center justify-between border-b border-[#27272a] pb-4 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="text-xs text-[#a1a1aa] hover:text-white flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <ArrowLeft size={14} />
            <span>Back to All Created Posts</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 flex items-center gap-1">
              <Check size={11} />
              <span>Saved in Library</span>
            </span>

            <Button
              size="sm"
              variant="outline"
              onClick={handleStartWizard}
              className="border-[#27272a] text-xs space-x-1 cursor-pointer hover:border-white bg-[#141417]"
            >
              <Plus size={13} />
              <span>Create Another Post</span>
            </Button>
          </div>
        </div>

        {/* Post Title & Meta */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-white">{activePost.title}</h1>
            <p className="text-xs text-[#71717a] mt-0.5">
              Created on {new Date(activePost.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>

          <span className={`px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1.5 ${
            isImageText
              ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
              : isImageOnly 
              ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-300'
              : 'bg-[#3b82f6]/10 border-[#3b82f6]/30 text-[#38bdf8]'
          }`}>
            {isImageText ? (
              <>
                <Layers size={12} />
                <span>Image + Text (Nano Banana + Gemini)</span>
              </>
            ) : isImageOnly ? (
              <>
                <ImageIcon size={12} />
                <span>Image Only (Vertex AI Nano Banana)</span>
              </>
            ) : (
              <>
                <FileText size={12} />
                <span>Text Only (Gemini 2.5 Flash)</span>
              </>
            )}
          </span>
        </div>

        {/* MAIN RESULT DISPLAY */}
        {isImageText ? (
          /* Combined Image + Text View (Side by Side or Stacked) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Generated Image */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-[#27272a] bg-[#070709] flex items-center justify-center shadow-2xl">
                <img
                  src={activePost.imageUrl}
                  alt={activePost.title}
                  className={`w-full object-contain block ${
                    activePost.aspectRatio === '16:9' ? 'aspect-video' : activePost.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-square'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleOpenRedesignModal(activePost)}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-yellow-300 hover:text-yellow-200 border border-yellow-500/30 text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer transition-all hover:scale-105"
                  title="Request AI Redesign with Vertex AI Nano Banana"
                >
                  <RotateCcw size={12} />
                  <span>Redesign</span>
                </button>
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-[#27272a] text-[10px] text-white font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span>Nano Banana • {activePost.aspectRatio || '1:1'}</span>
                </div>
              </div>

              {/* Redesign Request Callout Banner */}
              <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 text-[#a1a1aa] min-w-0">
                  <div className="w-6 h-6 rounded-md bg-yellow-400/10 text-yellow-400 flex items-center justify-center shrink-0">
                    <RotateCcw size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">Not happy with this image?</p>
                    <p className="text-[10px] text-[#71717a] truncate">Request an AI redesign with custom directives or presets.</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleOpenRedesignModal(activePost)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold space-x-1 cursor-pointer shrink-0"
                >
                  <Wand2 size={12} />
                  <span>Request Redesign</span>
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#71717a]">Pure generated PNG image</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenRedesignModal(activePost)}
                    className="border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10 hover:border-yellow-400 text-xs font-semibold space-x-1 cursor-pointer bg-[#141417]"
                  >
                    <RotateCcw size={12} />
                    <span>Redesign</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadImage(activePost, 'jpg')}
                    className="border-[#27272a] text-xs hover:border-white bg-[#141417] cursor-pointer"
                  >
                    <span>JPG</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownloadImage(activePost, 'png')}
                    className="bg-white hover:bg-neutral-200 text-black text-xs font-bold space-x-1 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download PNG</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Formatted Community Post Text */}
            <div className="lg:col-span-6 space-y-3">
              <Card className="p-4 bg-[#0e0e11] border-[#27272a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <YoutubeIcon size={16} className="text-[#e11d48]" />
                    <span>YouTube Community Copy</span>
                  </span>

                  <Button
                    size="sm"
                    onClick={() => handleCopyText(`${detailEditText}\n\n${(activePost.hashtags || []).join(' ')}`, activePost.id)}
                    className="bg-[#fafafa] hover:bg-[#e4e4e7] text-black text-xs font-bold space-x-1 cursor-pointer"
                  >
                    {copiedId === activePost.id ? (
                      <>
                        <Check size={13} className="text-[#10b981]" />
                        <span className="text-[#10b981]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Post Text</span>
                      </>
                    )}
                  </Button>
                </div>

                <Textarea
                  rows={8}
                  value={detailEditText}
                  onChange={(e) => setDetailEditText(e.target.value)}
                  className="bg-[#000000] text-xs text-[#e4e4e7] leading-relaxed font-sans"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(activePost.hashtags || []).map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[11px] text-[#38bdf8] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Prompt Note */}
              <Card className="p-3 bg-[#0e0e11] border-[#27272a] space-y-1">
                <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider block">
                  Requirement Prompt Used:
                </span>
                <p className="text-[11px] text-[#a1a1aa] leading-relaxed line-clamp-2">
                  {activePost.prompt}
                </p>
              </Card>
            </div>
          </div>
        ) : isImageOnly ? (
          /* Pure Generated Image View */
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#27272a] bg-[#070709] flex items-center justify-center shadow-2xl">
              <img
                src={activePost.imageUrl}
                alt={activePost.title}
                className={`w-full object-contain block ${
                  activePost.aspectRatio === '16:9' ? 'aspect-video max-h-[70vh]' : activePost.aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[70vh]' : 'aspect-square max-h-[70vh]'
                }`}
              />
              <button
                type="button"
                onClick={() => handleOpenRedesignModal(activePost)}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-yellow-300 hover:text-yellow-200 border border-yellow-500/30 text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer transition-all hover:scale-105"
                title="Request AI Redesign with Vertex AI Nano Banana"
              >
                <RotateCcw size={13} />
                <span>Request Redesign</span>
              </button>
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-[#27272a] text-[10px] text-white font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <span>Format: {activePost.aspectRatio || '1:1'} • High-Res PNG</span>
              </div>
            </div>

            {/* Redesign Request Callout Banner */}
            <div className="p-3.5 rounded-xl bg-[#141417] border border-[#27272a] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2.5 text-[#a1a1aa] min-w-0">
                <div className="w-7 h-7 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center shrink-0">
                  <RotateCcw size={14} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">Not happy with this generated image?</p>
                  <p className="text-[11px] text-[#71717a] truncate">Request an AI redesign with custom directives, lighting tweaks, or new presets.</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleOpenRedesignModal(activePost)}
                className="bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold space-x-1.5 cursor-pointer shrink-0 shadow-sm"
              >
                <Wand2 size={13} />
                <span>Request Redesign</span>
              </Button>
            </div>

            {/* Previous Revision History if available */}
            {activePost.revisions && activePost.revisions.length > 0 && (
              <Card className="p-3 bg-[#0e0e11] border-[#27272a] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#71717a] uppercase tracking-wider flex items-center gap-1">
                    <History size={12} />
                    <span>Iteration History ({activePost.revisions.length} previous)</span>
                  </span>
                  <span className="text-[10px] text-[#71717a]">Click to restore an earlier artwork</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {activePost.revisions.map((rev, idx) => (
                    <div
                      key={idx}
                      className="group relative w-16 h-16 rounded-lg overflow-hidden border border-[#27272a] shrink-0 bg-black cursor-pointer hover:border-yellow-400 transition-colors"
                      onClick={() => handleRevertRevision(rev)}
                      title="Restore this version"
                    >
                      <img src={rev.imageUrl} alt={`Rev ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-bold transition-opacity">
                        Restore
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Prompt details */}
            <Card className="p-4 bg-[#0e0e11] border-[#27272a] space-y-1.5">
              <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider block">
                Requirement Prompt Used:
              </span>
              <p className="text-xs text-[#d4d4d8] leading-relaxed">
                {activePost.prompt}
              </p>
            </Card>
          </div>
        ) : (
          /* YouTube Community Text Post View */
          <div className="space-y-4">
            <Card className="p-5 bg-[#0e0e11] border-[#27272a] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <YoutubeIcon size={16} className="text-[#e11d48]" />
                  <span>YouTube Community Post Text</span>
                </span>

                <Button
                  size="sm"
                  onClick={() => handleCopyText(`${detailEditText}\n\n${(activePost.hashtags || []).join(' ')}`, activePost.id)}
                  className="bg-[#fafafa] hover:bg-[#e4e4e7] text-black text-xs font-bold space-x-1 cursor-pointer"
                >
                  {copiedId === activePost.id ? (
                    <>
                      <Check size={13} className="text-[#10b981]" />
                      <span className="text-[#10b981]">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Full Post Text</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Editable Text Preview */}
              <div className="space-y-2">
                <Textarea
                  rows={9}
                  value={detailEditText}
                  onChange={(e) => setDetailEditText(e.target.value)}
                  className="bg-[#000000] text-xs text-[#e4e4e7] leading-relaxed font-sans"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(activePost.hashtags || []).map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[11px] text-[#38bdf8] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* FINAL ACTION TOOLBAR: SHARE ON YOUTUBE & DOWNLOAD */}
        <div className="p-4 bg-[#111114] border border-[#27272a] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center space-x-2 text-xs text-[#a1a1aa]">
            <CheckCircle2 size={16} className="text-[#10b981]" />
            <span>Ready to publish on your channel's YouTube Community tab.</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {hasImage && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleOpenRedesignModal(activePost)}
                  className="border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10 hover:border-yellow-400 text-xs font-semibold space-x-1.5 cursor-pointer bg-[#18181b]"
                >
                  <RotateCcw size={13} />
                  <span>Redesign Image</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDownloadImage(activePost, 'jpg')}
                  className="border-[#27272a] text-xs hover:border-white bg-[#18181b] cursor-pointer"
                >
                  <span>Download JPG</span>
                </Button>

                <Button
                  onClick={() => handleDownloadImage(activePost, 'png')}
                  className="bg-white hover:bg-neutral-200 text-black text-xs font-bold space-x-1 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download PNG</span>
                </Button>
              </>
            )}

            {hasText && (
              <Button
                variant="outline"
                onClick={() => handleCopyText(`${detailEditText}\n\n${(activePost.hashtags || []).join(' ')}`, activePost.id)}
                className="border-[#27272a] text-xs hover:border-white bg-[#18181b] space-x-1 cursor-pointer"
              >
                <Copy size={13} />
                <span>{copiedId === activePost.id ? 'Copied Text!' : 'Copy Text'}</span>
              </Button>
            )}

            <Button
              onClick={(e) => handleShareToYouTube(activePost, e)}
              className="bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold space-x-1.5 cursor-pointer shadow-lg shadow-[#e11d48]/20"
            >
              <Share2 size={14} />
              <span>Share on YouTube</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // YOUTUBE SHARE DIALOG MODAL
  // =========================================================================
  return (
    <>
      {isShareModalOpen && shareTargetPost && (
        <Dialog
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title="Share on YouTube Community"
          description="Follow these simple steps to post your AI content directly to your YouTube Community tab."
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 pt-1 text-xs">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a] flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-[#e11d48]/20 text-[#e11d48] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-bold text-white">
                  {shareTargetPost.type === 'image_text'
                    ? 'Download Generated Image & Copy Post Text'
                    : shareTargetPost.type === 'image'
                    ? 'Download Generated Image'
                    : 'Copy Formatted Community Text'}
                </p>
                <p className="text-[11px] text-[#a1a1aa]">
                  {shareTargetPost.type === 'image_text'
                    ? 'Download your high-resolution visual and copy your formatted post copy with hashtags.'
                    : shareTargetPost.type === 'image'
                    ? 'Save your high-res PNG visual to your device.'
                    : 'Copy the hook, message, and hashtags to your clipboard.'}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  {shareTargetPost.imageUrl && (
                    <Button
                      size="sm"
                      onClick={() => handleDownloadImage(shareTargetPost, 'png')}
                      className="bg-[#fafafa] hover:bg-[#e4e4e7] text-black text-xs space-x-1 font-semibold"
                    >
                      <Download size={12} />
                      <span>Download PNG</span>
                    </Button>
                  )}

                  {shareTargetPost.postText && (
                    <Button
                      size="sm"
                      onClick={() => handleCopyText(`${shareTargetPost.postText}\n\n${(shareTargetPost.hashtags || []).join(' ')}`, shareTargetPost.id)}
                      className="bg-[#fafafa] hover:bg-[#e4e4e7] text-black text-xs space-x-1 font-semibold"
                    >
                      <Copy size={12} />
                      <span>Copy Text</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a] flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-[#e11d48]/20 text-[#e11d48] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-bold text-white">Open YouTube Studio Community Tab</p>
                <p className="text-[11px] text-[#a1a1aa]">
                  Go to your YouTube Studio Community tab where creator posts are published.
                </p>
                <a
                  href="https://studio.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#38bdf8] hover:underline font-semibold mt-1"
                >
                  <span>Open studio.youtube.com</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a] flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-[#e11d48]/20 text-[#e11d48] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-bold text-white">Publish Your Post</p>
                <p className="text-[11px] text-[#a1a1aa]">
                  {shareTargetPost.type === 'image_text'
                    ? 'Paste your text, click the image icon to upload the downloaded PNG, and publish!'
                    : shareTargetPost.type === 'image'
                    ? 'Click the image icon in YouTube Community tab, upload your downloaded PNG, and publish!'
                    : 'Paste the copied post text into the Community text box and hit Post!'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsShareModalOpen(false)}
                className="border-[#27272a] text-xs cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* ========================================================================= */}
      {/* ARTWORK REDESIGN REQUEST DIALOG MODAL */}
      {/* ========================================================================= */}
      {isRedesignModalOpen && redesignTargetPost && (
        <Dialog
          isOpen={isRedesignModalOpen}
          onClose={() => !isRedesigning && setIsRedesignModalOpen(false)}
          title="Request Artwork Redesign"
          description="Direct Google Vertex AI Nano Banana on what to adjust, improve, or restyle."
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 pt-1 text-xs">
            {/* Current Reference Card */}
            <div className="p-3.5 rounded-xl bg-[#141417] border border-[#27272a] flex items-center gap-3.5">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#3f3f46] shrink-0 bg-[#09090b] flex items-center justify-center">
                <img
                  src={redesignTargetPost.imageUrl}
                  alt="Current Version"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] text-[#fafafa] font-mono">
                  {redesignTargetPost.aspectRatio || '1:1'}
                </span>
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                    Current Version
                  </span>
                  {redesignTargetPost.revisions?.length > 0 && (
                    <span className="text-[10px] text-[#a1a1aa]">
                      ({redesignTargetPost.revisions.length} previous revision{redesignTargetPost.revisions.length > 1 ? 's' : ''})
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-white text-xs truncate">{redesignTargetPost.title}</h4>
                <p className="text-[11px] text-[#a1a1aa] line-clamp-2 leading-relaxed">
                  {redesignTargetPost.prompt}
                </p>
              </div>
            </div>

            {/* Quick Adjustment Directives (Presets) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles size={13} className="text-yellow-400" />
                <span>Quick Style Directives (Click to toggle)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {REDESIGN_PRESETS.map((preset) => {
                  const isSelected = redesignSelectedTags.includes(preset.id);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      disabled={isRedesigning}
                      onClick={() => handleToggleRedesignTag(preset.id)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-yellow-400/15 border-yellow-400 text-yellow-300 shadow-sm'
                          : 'bg-[#141417] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white'
                      }`}
                    >
                      {preset.icon && <preset.icon size={13} className={isSelected ? 'text-yellow-400' : 'text-[#a1a1aa]'} />}
                      <span>{preset.label}</span>
                      {isSelected && <Check size={11} className="text-yellow-400 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Revision Feedback Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span>What specific changes would you like?</span>
                <span className="text-[10px] text-[#71717a] font-normal">Custom Prompt Guidance</span>
              </label>
              <Textarea
                rows={3}
                disabled={isRedesigning}
                value={redesignFeedback}
                onChange={(e) => setRedesignFeedback(e.target.value)}
                placeholder="e.g. Change the background to a dark futuristic studio with warm copper lighting. Move the product angle to 45 degrees, ensure the brand logo is cleanly rendered in the upper-right corner."
                className="bg-[#000000] text-xs text-[#fafafa] placeholder:text-[#52525b] border-[#27272a] focus:border-yellow-400 leading-relaxed"
              />
            </div>

            {/* Aspect Ratio & Brand Asset Confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#fafafa]">Target Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: '1:1', label: '1:1 Square' },
                    { id: '16:9', label: '16:9 Wide' },
                    { id: '9:16', label: '9:16 Story' }
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      type="button"
                      disabled={isRedesigning}
                      onClick={() => setRedesignAspectRatio(ratio.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                        redesignAspectRatio === ratio.id
                          ? 'bg-yellow-400/15 border-yellow-400 text-yellow-300 font-bold'
                          : 'bg-[#141417] border-[#27272a] text-[#a1a1aa] hover:text-white'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Reference Logo Asset */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#fafafa]">Reference Brand Assets</label>
                <div className="p-2 rounded-lg bg-[#141417] border border-[#27272a] flex items-center space-x-2 text-[11px] text-[#a1a1aa]">
                  <img src="/LOGO.png" alt="Logo" className="w-6 h-6 rounded object-contain bg-black border border-[#27272a] p-0.5" />
                  <span className="truncate">LOGO.png (Verified Active Reference)</span>
                </div>
              </div>
            </div>

            {/* Previous Revision History (if available) */}
            {redesignTargetPost.revisions && redesignTargetPost.revisions.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-[#27272a]">
                <label className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider flex items-center gap-1">
                  <History size={12} />
                  <span>Previous Iterations ({redesignTargetPost.revisions.length})</span>
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {redesignTargetPost.revisions.map((rev, idx) => (
                    <div
                      key={idx}
                      className="group relative w-14 h-14 rounded-lg overflow-hidden border border-[#27272a] shrink-0 bg-black cursor-pointer hover:border-yellow-400 transition-colors"
                      onClick={() => handleRevertRevision(rev)}
                      title="Click to revert to this version"
                    >
                      <img src={rev.imageUrl} alt={`Rev ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-bold transition-opacity">
                        Restore
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-[#27272a]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isRedesigning}
                onClick={() => handleEditInWizard(redesignTargetPost)}
                className="border-[#27272a] text-xs text-[#a1a1aa] hover:text-white bg-[#141417] cursor-pointer"
              >
                <span>Edit in Full Wizard</span>
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isRedesigning}
                  onClick={() => setIsRedesignModalOpen(false)}
                  className="border-[#27272a] text-xs cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={isRedesigning}
                  onClick={handleSubmitRedesign}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold space-x-1.5 cursor-pointer shadow-lg shadow-yellow-400/20"
                >
                  {isRedesigning ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Synthesizing Redesign...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={13} />
                      <span>Synthesize Redesign (20 Credits • {brandCredits} remaining)</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
