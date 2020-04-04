export type TabOption = {
  label: string;
  content: React.ReactNode | string;
};

export type TabProps = {
  options: TabOption[];
  value: number;
};

export type DefaultProps = Pick<TabProps, 'value'>;
