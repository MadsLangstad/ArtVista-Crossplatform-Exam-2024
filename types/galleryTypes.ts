export interface ArtworkItemProps {
  id: string;
  title: string;
  image: string;
  abstract: string;
}

export interface ArtworkItemComponentProps {
  item: ArtworkItemProps;
  handlePress: (item: ArtworkItemProps) => void;
}
