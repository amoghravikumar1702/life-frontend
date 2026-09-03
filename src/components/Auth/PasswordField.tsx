"use client";

import { useMemo, useState } from "react";

type RequirementProps = {
  met: boolean;
  label: string;
};

function Requirement({
  met,
  label,
}: RequirementProps) {
  return (
    <span
      className={`
        flex
        items-center
        gap-1.5
        text-[10px]
        transition-colors
        duration-300
        ${
          met
            ? "text-[#D4AF37]/75"
            : "text-zinc-700"
        }
      `}
    >
      <span
        className={`
          h-1
          w-1
          rounded-full
          transition-all
          duration-300
          ${
            met
              ? "bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.5)]"
              : "bg-zinc-700"
          }
        `}
      />

      {label}
    </span>
  );
}

export default function PasswordField() {
  const [password, setPassword] = useState("");

  const strength = useMemo(() => {
    if (!password) {
      return {
        score: 0,
        label: "",
      };
    }

    let score = 0;

    if (password.length >= 10) {
      score += 1;
    }

    if (password.length >= 14) {
      score += 1;
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    }

    if (/\d/.test(password)) {
      score += 1;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }

    if (score <= 2) {
      return {
        score: 1,
        label: "Weak",
      };
    }

    if (score <= 4) {
      return {
        score: 2,
        label: "Moderate",
      };
    }

    return {
      score: 3,
      label: "Strong",
    };
  }, [password]);

  const isStrong = strength.score === 3;

  return (
    <div>
      <input
        id="password"
        name="password"
        type="password"
        required
        minLength={10}
        maxLength={128}
        autoComplete="new-password"
        placeholder="Create a password"
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        className="
          h-14
          w-full
          rounded-xl
          border
          border-white/[0.08]
          bg-black/20
          px-4
          text-sm
          text-zinc-100
          outline-none
          transition
          placeholder:text-zinc-700
          focus:border-[#D4AF37]/40
          focus:bg-black/30
          focus:ring-1
          focus:ring-[#D4AF37]/10
        "
      />

      {password && (
        <div className="mt-3">
          {/* Strength bar */}

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-1.5">
              {[1, 2, 3].map((level) => {
                const active =
                  strength.score >= level;

                return (
                  <div
                    key={level}
                    className={`
                      h-1
                      flex-1
                      overflow-hidden
                      rounded-full
                      transition-all
                      duration-500
                      ${
                        active
                          ? level === 1
                            ? "bg-zinc-400"
                            : level === 2
                            ? "bg-[#B8A36A]"
                            : "bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.55)]"
                          : "bg-white/[0.07]"
                      }
                    `}
                  />
                );
              })}
            </div>

            <span
              className={`
                min-w-[72px]
                text-right
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.18em]
                transition-all
                duration-300
                ${
                  strength.score === 1
                    ? "text-zinc-400"
                    : strength.score === 2
                    ? "text-[#B8A36A]"
                    : "text-[#F3D37A] drop-shadow-[0_0_8px_rgba(212,175,55,0.35)]"
                }
              `}
            >
              {strength.label}
            </span>
          </div>

          {/* Requirements */}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            <Requirement
              met={password.length >= 10}
              label="10+ characters"
            />

            <Requirement
              met={/[A-Z]/.test(password)}
              label="Uppercase"
            />

            <Requirement
              met={/[a-z]/.test(password)}
              label="Lowercase"
            />

            <Requirement
              met={/\d/.test(password)}
              label="Number"
            />

            <Requirement
              met={/[^A-Za-z0-9]/.test(password)}
              label="Symbol"
            />
          </div>

          {/* Guidance */}

          {!isStrong && (
            <p className="mt-2 text-[10px] text-zinc-600">
              Add more character variety to
              strengthen your password.
            </p>
          )}

          {isStrong && (
            <p className="mt-2 text-[10px] font-medium text-[#D4AF37]/75">
              Strong password
            </p>
          )}
        </div>
      )}
    </div>
  );
}