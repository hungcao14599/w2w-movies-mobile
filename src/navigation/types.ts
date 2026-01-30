import { Movie, MovieDetail } from '../types';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  MovieDetail: { slug: string };
  WatchMovie: { slug: string };
  Search: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Movies: undefined;
  TVShows: undefined;
  Profile: undefined;
};
