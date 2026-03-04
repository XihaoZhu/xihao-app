export default function CutBall() {
    return (
        <svg
            viewBox="0 0 100 100"
            className="absolute w-[15vw] h-[15vw] pointer-events-none overflow-visible"
        >
            <defs>
                <filter id="ballGlow" x="-200%" y="-200%" width="500%" height="500%">

                    {/* ===== 外发光 1 ===== */}
                    <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="spread1" />
                    <feGaussianBlur in="spread1" stdDeviation="8" result="blur1" />
                    <feFlood floodColor="rgba(255,255,255,0.45)" result="color1" />
                    <feComposite in="color1" in2="blur1" operator="in" result="glow1" />


                    <feMorphology in="SourceAlpha" operator="dilate" radius="8" result="spread2" />
                    <feGaussianBlur in="spread2" stdDeviation="8" result="blur2" />
                    <feFlood floodColor="rgba(200,204,208,0.35)" result="color2" />
                    <feComposite in="color2" in2="blur2" operator="in" result="glow2" />

                    {/* ===== 合并外发光 ===== */}
                    <feMerge result="outerGlow">
                        <feMergeNode in="glow1" />
                        <feMergeNode in="glow2" />
                    </feMerge>

                    {/* ===== 内高光 ===== */}
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="innerBlur1" />
                    <feComposite in="innerBlur1" in2="SourceAlpha" operator="in" result="innerMask1" />
                    <feFlood floodColor="rgba(255,255,255,0.35)" result="innerColor1" />
                    <feComposite in="innerColor1" in2="innerMask1" operator="in" result="innerGlow" />

                    {/* ===== 内暗部 ===== */}
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="innerBlur2" />
                    <feComposite in="innerBlur2" in2="SourceAlpha" operator="in" result="innerMask2" />
                    <feFlood floodColor="rgba(40,40,40,0.55)" result="innerColor2" />
                    <feComposite in="innerColor2" in2="innerMask2" operator="in" result="innerShadow" />

                    {/* ===== 最终合并 ===== */}
                    <feMerge>
                        <feMergeNode in="outerGlow" />
                        <feMergeNode in="SourceGraphic" />
                        <feMergeNode in="innerGlow" />
                        <feMergeNode in="innerShadow" />
                    </feMerge>

                </filter>
            </defs>

            <path
                d="M25 6.7 A50 50 0 1 1 0 50 L50 50 Z"
                fill="auto"
                filter="url(#ballGlow)"
            />
        </svg>
    );
}