export function CircleProgress({
  size = 120,
  strokeWidth = 8,
  progress = 0, // 0 - 100
  trackColor = "#eee",
  progressColor = "#232323",
  children,
  className,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-block",
      }}
      {...(className ? { className } : {})}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill='none'
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill='none'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
          style={{
            transition: "stroke-dashoffset 0.3s ease",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>

      {/* 中间内容（可选） */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.2,
          fontWeight: 600,
        }}
      >
        {children ?? `${progress}%`}
      </div>
    </div>
  );
}
