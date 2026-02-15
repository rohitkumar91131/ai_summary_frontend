import React, { useEffect, useRef } from "react";
import { X, Copy, Check } from "lucide-react";
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    TelegramShareButton,
    RedditShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon,
    TelegramIcon,
    RedditIcon,
} from "react-share";
import gsap from "gsap";
import { toast } from "sonner";

export default function ShareModal({ isOpen, onClose, url, title }) {
    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    const [copied, setCopied] = React.useState(false);

    useEffect(() => {
        if (isOpen) {
            // Animate entry
            const ctx = gsap.context(() => {
                gsap.fromTo(
                    overlayRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: "power2.out" }
                );
                gsap.fromTo(
                    modalRef.current,
                    { scale: 0.8, opacity: 0, y: 20 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)", delay: 0.1 }
                );
            });
            return () => ctx.revert();
        }
    }, [isOpen]);

    const handleClose = () => {
        // Animate exit
        const ctx = gsap.context(() => {
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
            gsap.to(modalRef.current, {
                scale: 0.8,
                opacity: 0,
                y: 20,
                duration: 0.2,
                onComplete: onClose,
            });
        });
        // We don't revert here because we want the animation to finish before unmounting (controlled by parent)
        // However, typically the parent unmounts based on isOpen. 
        // If the parent simply stops rendering, the exit animation won't play unless we delay the onClose callback.
        // Ideally, we'd use AnimatePresence or similar, but with raw GSAP, a callback is best.
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Link copied!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-slate-800">Share Summary</h3>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-slate-500 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="grid grid-cols-4 gap-4 mb-6 justify-items-center">
                        <TwitterShareButton url={url} title={title}>
                            <div className="flex flex-col items-center gap-2 group">
                                <TwitterIcon size={48} round className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs text-slate-500 font-medium">Twitter</span>
                            </div>
                        </TwitterShareButton>

                        <FacebookShareButton url={url} quote={title}>
                            <div className="flex flex-col items-center gap-2 group">
                                <FacebookIcon size={48} round className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs text-slate-500 font-medium">Facebook</span>
                            </div>
                        </FacebookShareButton>

                        <LinkedinShareButton url={url} title={title}>
                            <div className="flex flex-col items-center gap-2 group">
                                <LinkedinIcon size={48} round className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs text-slate-500 font-medium">LinkedIn</span>
                            </div>
                        </LinkedinShareButton>

                        <WhatsappShareButton url={url} title={title}>
                            <div className="flex flex-col items-center gap-2 group">
                                <WhatsappIcon size={48} round className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs text-slate-500 font-medium">WhatsApp</span>
                            </div>
                        </WhatsappShareButton>

                        <TelegramShareButton url={url} title={title}>
                            <div className="flex flex-col items-center gap-2 group">
                                <TelegramIcon size={48} round className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs text-slate-500 font-medium">Telegram</span>
                            </div>
                        </TelegramShareButton>

                        <RedditShareButton url={url} title={title}>
                            <div className="flex flex-col items-center gap-2 group">
                                <RedditIcon size={48} round className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs text-slate-500 font-medium">Reddit</span>
                            </div>
                        </RedditShareButton>
                    </div>

                    {/* Copy Link Section */}
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-200">
                        <input
                            type="text"
                            readOnly
                            value={url}
                            className="flex-1 bg-transparent text-sm text-slate-600 outline-none truncate"
                        />
                        <button
                            onClick={copyToClipboard}
                            className={`p-2 rounded-lg transition-all duration-200 ${copied
                                    ? "bg-green-100 text-green-600"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
