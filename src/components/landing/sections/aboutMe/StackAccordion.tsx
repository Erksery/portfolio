import styles from "./index.module.scss";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

import { myStack } from "./myStack";
import SpotlightCard from "@/components/spotlight/SpotlightCard";
import { TechItem } from "./TechItem";
import type { TechType } from "@/types/global.types";

export const StackAccordion = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(
    myStack[0]?.id ?? null,
  );

  const [activeTech, setActiveTech] = useState<TechType | null>(null);
  const [isPopoverMounted, setIsPopoverMounted] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const closeTimeout = useRef<number | null>(null);
  const unmountTimeout = useRef<number | null>(null);

  const { refs, floatingStyles, update } = useFloating({
    placement: "top-start",
    middleware: [
      offset(10),
      flip({
        padding: 10,
      }),
      shift({
        padding: 10,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const handleTechEnter = (tech: TechType, element: HTMLDivElement) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    if (unmountTimeout.current) {
      clearTimeout(unmountTimeout.current);
    }
    refs.setReference(element);

    setActiveTech(tech);

    if (!isPopoverMounted) {
      setIsPopoverMounted(true);

      requestAnimationFrame(() => {
        setIsPopoverVisible(true);
      });
    } else {
      setIsPopoverVisible(true);
    }
    requestAnimationFrame(() => {
      update();
    });
  };

  const handleTechLeave = () => {
    closeTimeout.current = window.setTimeout(() => {
      setIsPopoverVisible(false);

      unmountTimeout.current = window.setTimeout(() => {
        setIsPopoverMounted(false);
        setActiveTech(null);
      }, 180);
    }, 100);
  };

  const handlePopoverEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }

    if (unmountTimeout.current) {
      clearTimeout(unmountTimeout.current);
    }

    setIsPopoverVisible(true);
  };

  return (
    <>
      <div className={styles.stack_list}>
        {myStack.map((item) => {
          const isOpen = openIndex === item.id;

          return (
            <SpotlightCard key={item.id}>
              <div className={styles.accordion_item}>
                <div className={styles.item}>
                  {item.icon}

                  <button onClick={() => setOpenIndex(isOpen ? null : item.id)}>
                    <span className={styles.title}>{item.title}</span>

                    <ChevronDown
                      className={styles.chevron}
                      data-open={isOpen}
                    />
                  </button>
                </div>

                <div className={styles.content} data-open={isOpen}>
                  <div className={styles.inner}>
                    <hr className={styles.devider} />

                    <div className={styles.items_list}>
                      {item.items.map((tech) => (
                        <TechItem
                          key={tech.id}
                          {...tech}
                          onMouseEnter={(element) =>
                            handleTechEnter(tech, element)
                          }
                          onMouseLeave={handleTechLeave}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {isPopoverMounted && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={styles.popover}
          data-visible={isPopoverVisible}
          onMouseEnter={handlePopoverEnter}
          onMouseLeave={handleTechLeave}
        >
          <div className={styles.popover_inner}>
            <div className={styles.popover_inner_header}>
              {activeTech?.icon}
              <span>{activeTech?.title}</span>
            </div>
            <p className="secondary_text">{activeTech?.description}</p>
          </div>
        </div>
      )}
    </>
  );
};
