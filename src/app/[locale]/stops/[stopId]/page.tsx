import {StopDetailsPage} from '@/features/stops/StopDetailsPage';

type Props = {
  params: {
    stopId: string;
  };
};

export default function Page({params}: Props) {
  return <StopDetailsPage stopId={params.stopId} />;
}
