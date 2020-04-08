export type TabOption = {
  label: string;
  content: React.ReactNode | string;
};

export type TabProps = {
  options: TabOption[];
  value: number;
  onChange: (value: number) => void;
};

export type DefaultProps = Pick<TabProps, 'value' | 'onChange'>;
