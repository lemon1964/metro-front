// src/@types/mom.ts
export type FormState = {
    dob: string;
    name: string;
    fav: string;
  };
  
  export type NameTone = {
    base: string;
    overrides: string[];
  };
  
  export type LifePathMeaning = {
    title: string;
    short: string;
    long: string[];
    do: string[];
    dont: string[];
    motto: string;
  };
  
  export type HintsByChannel = {
    low: string[];
    mid: string[];
    high: string[];
  };
  
  export type HintsConfig = {
    thresholds: {
      low: number;
      high: number;
    };
    phys: HintsByChannel;
    emo: HintsByChannel;
    intel: HintsByChannel;
  };
  
  export type ComputedResult = {
    bio: {
      phys: number;
      emo: number;
      intel: number;
    };
    zeros: {
      physIn: number | null;
      emoIn: number | null;
      intelIn: number | null;
    };
    physHints: string[];
    emoHints: string[];
    intHints: string[];
    lp: {
      value: string;
    };
    lpMeaning: LifePathMeaning;
    nn: {
      value: number;
    };
    nameTone: NameTone;
    favText: string;
    temperamentProfilesCount: number;
  };
  