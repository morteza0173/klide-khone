import { createLocation } from "@/app/action";
import CreationButtonBar from "@/components/CreationButtonBar";
import FormContainer from "@/components/FormContainer";
import { Skeleton } from "@/components/ui/skeleton";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

function AddressRoute({ params }: { params: { id: string } }) {
  const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <Skeleton className="h-[50vh] w-full" />,
  });

  return (
    <>
      <div className="w-[90%] lg:w-3/5 mx-auto">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold transition-colors mb-10">
          محل خانه ی خود را انتخاب کنید
        </h2>
      </div>

      <FormContainer action={createLocation}>
        <input type="hidden" name="homeId" value={params.id} />

        <div className="w-[90%] lg:w-3/5 mx-auto mb-36">
          <Map />
        </div>
        <CreationButtonBar />
      </FormContainer>
    </>
  );
}
export default AddressRoute;
