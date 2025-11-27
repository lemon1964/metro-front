// src/@types/mom.d.ts
type FormState = {
    dob: string;
    name: string;
    fav: string;
  };
  
type NameTone = {
    base: string;
    overrides: string[];
  };
  
type LifePathMeaning = {
    title: string;
    short: string;
    long: string[];
    do: string[];
    dont: string[];
    motto: string;
  };
  
type HintsByChannel = {
    low: string[];
    mid: string[];
    high: string[];
  };
  
type HintsConfig = {
    thresholds: {
      low: number;
      high: number;
    };
    phys: HintsByChannel;
    emo: HintsByChannel;
    intel: HintsByChannel;
  };
  
type ComputedResult = {
    bio: {
      phys: number;
      emo: number;
      intel: number;
    };
    peaks: {
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
