import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { Input, Textarea } from '../ui/Input';
import { formatCents } from '../../lib/utils';
import { 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Package, 
  CheckCircle2, 
  PlusCircle, 
  Briefcase, 
  MessageSquare,
  Search,
  ExternalLink,
  ChevronRight,
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export function GigChatInbox({
  conversations = [],
  activeConversationId = null,
  activePortal = 'brand', // 'brand' | 'creator'
  creators = [],
  currentUser = null,
  onSendMessage,
  onSendCustomOffer,
  onAcceptCustomOffer,
  onNavigate
}) {
  const [selectedConvId, setSelectedConvId] = useState(() => {
    return activeConversationId || conversations[0]?.id || null;
  });

  const [messageText, setMessageText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [acceptingOfferId, setAcceptingOfferId] = useState(null);

  // New Custom Offer Form State
  const [offerTitle, setOfferTitle] = useState('Dedicated 4K Technical Review + 2x Shorts');
  const [offerPrice, setOfferPrice] = useState('1200');
  const [offerDays, setOfferDays] = useState('6');
  const [offerDeliverables, setOfferDeliverables] = useState(
    '1x 10-12 min 4K In-Depth Tutorial\n2x High-Velocity YouTube Shorts\nDedicated GitHub repository with 1-click deploy'
  );

  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom of messages container ONLY (does NOT scroll the window/page)
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    // Instant scroll on thread change so user sees the latest messages immediately
    scrollToBottom('auto');
  }, [selectedConvId]);

  useEffect(() => {
    // Smooth scroll when new messages arrive
    scrollToBottom('smooth');
  }, [conversations]);

  // Update selected conversation if prop changes
  useEffect(() => {
    if (activeConversationId) {
      setSelectedConvId(activeConversationId);
    }
  }, [activeConversationId]);

  // Current selected thread
  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  // Partner info based on portal role
  const isBrand = activePortal === 'brand';
  const partnerName = activeConv ? (isBrand ? activeConv.creatorName : activeConv.brandName) : '';
  const partnerAvatar = activeConv ? (isBrand ? activeConv.creatorAvatar : activeConv.brandAvatar) : '';
  const partnerHandle = activeConv ? (isBrand ? activeConv.creatorHandle : activeConv.brandName) : '';

  // Filtered threads list
  const filteredConversations = conversations.filter(c => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      c.creatorName?.toLowerCase().includes(q) ||
      c.creatorHandle?.toLowerCase().includes(q) ||
      c.brandName?.toLowerCase().includes(q) ||
      c.campaignTitle?.toLowerCase().includes(q)
    );
  });

  // Send standard text message
  const handleSendText = (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !activeConv) return;

    if (onSendMessage) {
      onSendMessage(activeConv.id, {
        text: messageText.trim(),
        senderRole: isBrand ? 'brand' : 'creator',
        senderName: isBrand ? (currentUser?.displayName || 'My Brand') : (activeConv.creatorName || 'Creator')
      });
    }

    setMessageText('');
  };

  // Submit custom gig offer
  const handleSubmitOffer = (e) => {
    e.preventDefault();
    if (!offerTitle.trim() || !offerPrice || !activeConv) return;

    const priceCents = Math.round((parseFloat(offerPrice) || 0) * 100);
    const deliverablesList = offerDeliverables
      .split('\n')
      .map(d => d.trim())
      .filter(Boolean);

    const offerPayload = {
      id: `offer_${Date.now()}`,
      title: offerTitle.trim(),
      priceCents,
      turnaroundDays: Number(offerDays) || 7,
      deliverables: deliverablesList.length > 0 ? deliverablesList : ['1x Dedicated 4K Video Integration'],
      status: 'pending',
      senderRole: isBrand ? 'brand' : 'creator'
    };

    if (onSendCustomOffer) {
      onSendCustomOffer(activeConv.id, offerPayload);
    }

    setIsOfferModalOpen(false);
  };

  // Accept Custom Offer & Fund Escrow
  const handleAcceptOffer = (offer) => {
    setAcceptingOfferId(offer.id);
    setTimeout(() => {
      if (onAcceptCustomOffer) {
        onAcceptCustomOffer(activeConv.id, offer, activeConv);
      }
      setAcceptingOfferId(null);
    }, 700);
  };

  // Quick reply chips
  const quickTemplates = isBrand
    ? [
        "Can you do a 60-second mid-roll integration?",
        "What is your turnaround time for the first draft?",
        "Can we request a revision on the opening hook?",
        "Sending over our brand creative brief now."
      ]
    : [
        "I can have the 4K draft ready in 5 business days.",
        "Sending over a custom gig offer tailored to your budget.",
        "Yes, 2 revision cycles and raw ProRes files are included.",
        "I've linked my recent YouTube case study above."
      ];

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-3 h-full">
      {/* Top Banner */}
      <div className="border-b border-[#27272a] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
              {isBrand ? 'Creator gig inbox & chat' : 'Brand messages & gig offers'}
            </h1>
            <Badge className="bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30 text-[10px]">
              Fiverr Gig Flow Active
            </Badge>
            <Badge className="bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30 text-[10px] flex items-center space-x-1">
              <ShieldCheck size={11} className="mr-0.5" />
              <span>Escrow Protected</span>
            </Badge>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Real-time direct messaging between brands and creators. Negotiate terms, send custom gig offers, and lock 100% pre-funded escrow.
          </p>
        </div>

        {/* Global Action */}
        <Button
          size="sm"
          onClick={() => setIsOfferModalOpen(true)}
          className="space-x-1.5 self-start sm:self-auto cursor-pointer bg-[#e11d48] hover:bg-[#be123c] text-white"
        >
          <PlusCircle size={14} />
          <span>{isBrand ? 'Propose Custom Gig' : 'Send Custom Gig Offer'}</span>
        </Button>
      </div>

      {/* Main 2-Column Chat Box */}
      <Card className="flex-1 min-h-0 p-0 overflow-hidden border-[#27272a] flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#27272a]">
        
        {/* Left Column: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col h-full min-h-0 overflow-hidden bg-[#09090b] shrink-0">
          {/* Search Bar */}
          <div className="p-3 border-b border-[#27272a] shrink-0">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-2.5 text-[#71717a]" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search inbox or creators..."
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#000000] border border-[#27272a] text-xs text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[#27272a]/60">
            {filteredConversations.map(conv => {
              const isSelected = conv.id === selectedConvId;
              const name = isBrand ? conv.creatorName : conv.brandName;
              const avatar = isBrand ? conv.creatorAvatar : conv.brandAvatar;
              const handle = isBrand ? conv.creatorHandle : conv.brandName;
              const lastMsg = conv.messages[conv.messages.length - 1];
              const hasOffer = conv.messages.some(m => m.type === 'custom_offer' && m.offer?.status === 'pending');

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#18181b] border-l-2 border-l-[#e11d48]' : 'hover:bg-[#121215]'
                  }`}
                >
                  <img
                    src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#27272a]"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#fafafa] truncate">{name}</span>
                      <span className="text-[10px] text-[#71717a] shrink-0">
                        {lastMsg ? lastMsg.timestamp.split(',')[0] : 'Today'}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#71717a] truncate">{handle}</div>

                    <p className="text-[11px] text-[#a1a1aa] truncate mt-1">
                      {lastMsg?.type === 'custom_offer' ? '📦 Custom Gig Offer Attached' : lastMsg?.text || 'No messages yet'}
                    </p>

                    {hasOffer && (
                      <div className="mt-1.5">
                        <Badge className="bg-[#10b981]/15 text-[#10b981] border-none text-[9px] px-1.5 py-0">
                          Pending Offer
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-xs text-[#71717a]">
                No conversation threads found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chat Stream & Gig Offer Actions */}
        <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-[#000000]">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-[#27272a] bg-[#09090b] flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={partnerAvatar}
                      alt={partnerName}
                      className="w-9 h-9 rounded-full object-cover border border-[#27272a]"
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-[#09090b] absolute bottom-0 right-0" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#fafafa]">{partnerName}</span>
                      <span className="text-[11px] text-[#71717a]">{partnerHandle}</span>
                      {isBrand && activeConv.creatorAiScore && (
                        <Badge className="bg-[#10b981]/15 text-[#10b981] border-none text-[9px] px-1.5 py-0">
                          AI {activeConv.creatorAiScore}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5 text-[10px] text-[#10b981]">
                      <span>Active now</span>
                      <span className="text-[#3f3f46]">•</span>
                      <span className="text-[#71717a]">Avg Response: 1 hr</span>
                      {activeConv.campaignTitle && (
                        <>
                          <span className="text-[#3f3f46]">•</span>
                          <span className="text-[#3b82f6] truncate max-w-[200px]">
                            {activeConv.campaignTitle}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsOfferModalOpen(true)}
                    className="border-[#27272a] text-xs text-[#fafafa] hover:border-[#e11d48] cursor-pointer"
                  >
                    <Package size={13} className="mr-1 text-[#e11d48]" />
                    <span>Custom Offer</span>
                  </Button>
                </div>
              </div>

              {/* Messages Stream */}
              <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                {activeConv.messages.map((msg, idx) => {
                  const isMe = isBrand ? msg.senderRole === 'brand' : msg.senderRole === 'creator';
                  const isOffer = msg.type === 'custom_offer' && msg.offer;

                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1.5`}
                    >
                      <div className="flex items-center space-x-1.5 text-[10px] text-[#71717a] px-1">
                        <span className="font-semibold text-[#a1a1aa]">{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Text Bubble */}
                      {msg.text && (
                        <div
                          className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#e11d48] text-white rounded-tr-none'
                              : 'bg-[#18181b] border border-[#27272a] text-[#fafafa] rounded-tl-none'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>
                      )}

                      {/* Fiverr-Style Interactive Custom Gig Offer Card */}
                      {isOffer && (
                        <div className="w-full max-w-md p-4 rounded-xl bg-[#121215] border-2 border-[#10b981]/40 space-y-3.5 shadow-xl">
                          <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#fafafa]">
                              <Package size={15} className="text-[#10b981]" />
                              <span>Custom Gig Offer</span>
                            </div>
                            <Badge className="bg-[#10b981]/20 text-[#10b981] border-none text-[10px]">
                              {msg.offer.status === 'accepted' ? 'Accepted & Escrow Locked' : 'Pending Review'}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-[#fafafa] tracking-tight">
                              {msg.offer.title}
                            </h4>
                            <div className="flex items-baseline space-x-2 mt-1">
                              <span className="text-xl font-bold text-[#10b981]">
                                {formatCents(msg.offer.priceCents)}
                              </span>
                              <span className="text-[11px] text-[#71717a]">
                                • {msg.offer.turnaroundDays} Days Turnaround
                              </span>
                            </div>
                          </div>

                          {/* Deliverables Checklist */}
                          <div className="space-y-1.5 bg-[#000000] p-3 rounded-lg border border-[#27272a]">
                            <span className="text-[10px] uppercase font-bold text-[#71717a] tracking-wider">
                              Scope of Deliverables:
                            </span>
                            {msg.offer.deliverables.map((item, dIdx) => (
                              <div key={dIdx} className="flex items-start space-x-2 text-[11px] text-[#d4d4d8]">
                                <CheckCircle2 size={13} className="text-[#10b981] shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>

                          {/* Escrow Guarantee Pill */}
                          <div className="flex items-center justify-between text-[10px] text-[#a1a1aa] pt-1">
                            <span className="flex items-center space-x-1 text-[#10b981]">
                              <ShieldCheck size={12} />
                              <span>100% Pre-Funded Escrow Protection</span>
                            </span>
                            <span>2 Revisions Included</span>
                          </div>

                          {/* Action Button for Buyer / Brand */}
                          {msg.offer.status === 'pending' ? (
                            isBrand ? (
                              <Button
                                size="sm"
                                onClick={() => handleAcceptOffer(msg.offer)}
                                disabled={acceptingOfferId === msg.offer.id}
                                className="w-full bg-[#10b981] hover:bg-[#059669] text-white space-x-1.5 cursor-pointer font-bold"
                              >
                                {acceptingOfferId === msg.offer.id ? (
                                  <span>Locking Escrow Deposit...</span>
                                ) : (
                                  <>
                                    <CheckCircle2 size={14} />
                                    <span>Accept Offer & Fund Escrow ({formatCents(msg.offer.priceCents)})</span>
                                  </>
                                )}
                              </Button>
                            ) : (
                              <div className="text-center p-2 rounded-lg bg-[#18181b] text-[11px] text-[#71717a]">
                                Waiting for brand to accept offer & deposit escrow.
                              </div>
                            )
                          ) : (
                            <div className="p-2.5 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-[#10b981] flex items-center space-x-1">
                                <CheckCircle2 size={13} />
                                <span>Escrow Contract Active</span>
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onNavigate && onNavigate('contracts')}
                                className="text-[11px] text-[#fafafa] hover:text-[#10b981] p-0 h-auto"
                              >
                                View Contract <ChevronRight size={12} className="inline" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Template Chips */}
              <div className="px-3 py-2 bg-[#09090b] border-t border-[#27272a] flex items-center space-x-2 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-[#71717a] uppercase font-semibold shrink-0">Quick reply:</span>
                {quickTemplates.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMessageText(chip)}
                    className="px-2.5 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-[11px] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] transition-colors shrink-0 cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Message Composer Footer */}
              <form onSubmit={handleSendText} className="p-3 bg-[#09090b] border-t border-[#27272a] flex items-center space-x-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOfferModalOpen(true)}
                  className="border-[#27272a] text-xs space-x-1 shrink-0 text-[#fafafa] hover:border-[#e11d48] cursor-pointer"
                >
                  <PlusCircle size={14} className="text-[#e11d48]" />
                  <span className="hidden sm:inline">Custom Offer</span>
                </Button>

                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Message ${partnerName}...`}
                  className="flex-1 h-9 px-3 rounded-lg bg-[#000000] border border-[#27272a] text-xs text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#e11d48]"
                />

                <Button
                  type="submit"
                  size="sm"
                  disabled={!messageText.trim()}
                  className="space-x-1 shrink-0 bg-[#e11d48] hover:bg-[#be123c] text-white cursor-pointer"
                >
                  <Send size={13} />
                  <span>Send</span>
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#71717a]">
              <MessageSquare size={32} className="mb-2 text-[#3f3f46]" />
              <h3 className="text-sm font-semibold text-[#fafafa]">No Conversation Selected</h3>
              <p className="text-xs mt-1">Select a creator from the inbox on the left to start negotiating gig terms.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Custom Gig Offer Modal */}
      {isOfferModalOpen && (
        <Dialog
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          title="Create custom gig offer"
          description={`Propose custom deliverables and price directly to ${partnerName}. Once accepted, escrow is funded automatically.`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSubmitOffer} className="space-y-4">
            <Input
              label="Offer Title"
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
              placeholder="e.g. Dedicated 4K Review + 2x Shorts"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Offer Price (USD $)"
                type="number"
                min="50"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                required
              />

              <Input
                label="Turnaround (Days)"
                type="number"
                min="1"
                value={offerDays}
                onChange={(e) => setOfferDays(e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Deliverables (One per line)"
              rows={3}
              value={offerDeliverables}
              onChange={(e) => setOfferDeliverables(e.target.value)}
              placeholder="1x Dedicated 4K Video&#10;2x YouTube Shorts&#10;Pinned comment with tracking link"
              required
            />

            <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] text-[11px] text-[#a1a1aa] flex items-center space-x-2">
              <ShieldCheck size={16} className="text-[#10b981] shrink-0" />
              <span>
                Standard 10% platform fee applies. Buyer pre-funds 100% of the offer into escrow before work commences.
              </span>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOfferModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#10b981] hover:bg-[#059669] text-white font-bold cursor-pointer"
              >
                Send Offer to Chat
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
