import React from "react";

export interface RichStringProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
}

export const RichString: React.FC<RichStringProps> = ({
  children: text,
  ...props
}) => {
  return React.useMemo(() => {
    const styles: React.CSSProperties[] = [];
    const exp = /<(.+?)=(.+?)>(.+?)<\/.+?>/g;
    let match: RegExpExecArray | null;
    let elements: React.ReactNode[] = [];
    let currentPos = 0;
    let n = 0;
    while ((match = exp.exec(text))) {
      const [full, prop, value, content] = match;
      if (!full || !prop) {
        break;
      }
      const length = full.length;
      styles.push({ [prop]: value });
      if (match.index > currentPos) {
        elements.push(text.substr(currentPos, match.index - currentPos));
      }
      elements.push(
        <span key={`_${n++}`} style={{ [prop]: value }}>
          {content}
        </span>
      );
      currentPos = match.index + length;
    }
    if (currentPos < text.length) {
      elements.push(text.substr(currentPos));
    }
    return <span {...props}>{elements}</span>;
  }, [text, props]);
};
