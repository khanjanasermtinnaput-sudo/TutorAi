"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass/GlassCard";
import { InlineMath } from "@/components/InlineMath";
import { SaveFormulaButton } from "@/components/formula/SaveFormulaButton";
import { cn } from "@/lib/utils/cn";

export type ChoiceKey = "A" | "B" | "C" | "D";
export type Choices = Record<ChoiceKey, string>;

const CHOICE_KEYS: ChoiceKey[] = ["A", "B", "C", "D"];

interface QuizQuestionCardBaseProps {
  index: number;
  questionText: string;
  choices: Choices;
}

interface AnswerModeProps extends QuizQuestionCardBaseProps {
  mode: "answer";
  selected: ChoiceKey | null;
  onSelect: (choice: ChoiceKey) => void;
}

interface ReviewModeProps extends QuizQuestionCardBaseProps {
  mode: "review";
  correctChoice: ChoiceKey;
  userAnswer: ChoiceKey | null;
  explanation: string;
}

type QuizQuestionCardProps = AnswerModeProps | ReviewModeProps;

export function QuizQuestionCard(props: QuizQuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { index, questionText, choices } = props;
  const allText = [questionText, ...Object.values(choices), props.mode === "review" ? props.explanation : ""].join(" ");

  return (
    <GlassCard className="p-5">
      <p className="mb-3 font-display font-medium text-ink-primary">
        {index + 1}. <InlineMath text={questionText} />
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {CHOICE_KEYS.map((key) => {
          const label = choices[key];
          if (props.mode === "answer") {
            const isSelected = props.selected === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => props.onSelect(key)}
                className={cn(
                  "glass-surface rounded-md p-3 text-left text-sm transition-colors",
                  isSelected ? "border-accent-primary bg-gradient-liquid text-white" : "text-ink-secondary hover:text-ink-primary",
                )}
              >
                <span className="mr-2 font-semibold">{key}.</span>
                <InlineMath text={label} />
              </button>
            );
          }

          const isCorrect = key === props.correctChoice;
          const isUserWrong = key === props.userAnswer && props.userAnswer !== props.correctChoice;
          return (
            <div
              key={key}
              className={cn(
                "glass-surface rounded-md p-3 text-sm",
                isCorrect && "glass-tint-success",
                isUserWrong && "glass-tint-error",
              )}
            >
              <span className="mr-2 font-semibold">{key}.</span>
              <InlineMath text={label} />
              {isCorrect && <span className="ml-2 text-xs text-success">คำตอบที่ถูกต้อง</span>}
              {isUserWrong && <span className="ml-2 text-xs text-error">คำตอบของคุณ</span>}
            </div>
          );
        })}
      </div>

      <SaveFormulaButton text={allText} source="quiz" className="mt-2" />

      {props.mode === "review" && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-sm font-medium text-accent-primary"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
            {expanded ? "ซ่อนคำอธิบาย" : "ดูเฉลยละเอียด"}
          </button>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="mt-2 overflow-hidden rounded-md bg-canvas-elevated p-3 text-sm text-ink-secondary"
            >
              <InlineMath text={props.explanation} />
            </motion.div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
