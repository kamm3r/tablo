import React, { useState } from "react";
import clsx from "clsx";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePlus,
  HiOutlineTrash,
  HiReply,
  HiSortAscending,
  HiSortDescending,
} from "react-icons/hi";

import Layout from "../components/layout";
import { AutoAnimate } from "../components/auto-animate";
import { Card } from "../components/card";
import { trpc } from "../utils/trpc";
import * as portals from "react-reverse-portal";
import {
  addAttemptInput,
  type AddAttemptInputType,
} from "../shared/add-athlete-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "../components/button";
import { TextInput } from "../components/input";
import Link from "next/link";

export default function Page() {
  const isSSR = typeof window === "undefined";

  const portalNode = React.useMemo(() => {
    if (isSSR) {
      return null;
    }
    return portals.createHtmlPortalNode();
  }, [isSSR]);
  const [reverseSort, setReverseSort] = useState(false);
  const [show, setShow] = useState(false);
  const [but, setBut] = useState(false);
  const [modal, setModal] = useState(false);
  const [id, setId] = useState<string>();
  // const toggle = (id: string) => {
  //   setModal((modal) => !modal);
  //   setId(id);
  // };
  const toggle = React.useCallback((id: string) => {
    setModal((modal) => !modal);
    setId(id);
  }, []);

  const { data, isLoading, refetch } = trpc.athletes.getAll.useQuery();

  const deleted = trpc.athletes.delete.useMutation({
    onSuccess: (data) => {
      console.log("deleted an athlete", data);
      refetch();
    },
  });
  const clearAll = trpc.athletes.deleteAll.useMutation({
    onSuccess: (data) => {
      console.log("Clear all", data);
      refetch();
    },
  });

  if (!data || isLoading) {
    return <div>No Data YET!</div>;
  }

  const Sorted = () => {
    if (reverseSort) {
      data.sort((a, b) => {
        const BValue = b.attempts.map((at) => parseFloat(at.attempt1));
        const AValue = a.attempts.map((at) => parseFloat(at.attempt1));
        return Math.max.apply(null, AValue) - Math.max.apply(null, BValue);
      });
      setReverseSort(!reverseSort);
    } else {
      data.sort((a, b) => {
        const BValue = b.attempts.map((at) => parseFloat(at.attempt1));
        const AValue = a.attempts.map((at) => parseFloat(at.attempt1));
        return Math.max.apply(null, BValue) - Math.max.apply(null, AValue);
      });
      setReverseSort(!reverseSort);
    }
  };

  return (
    <Layout title="Tablo">
      <div className="grid min-h-0 flex-1 grid-cols-7">
        <div className="col-span-1 flex flex-col gap-4 overflow-y-auto py-4 pl-6 pr-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-medium">
              <span>Timetable</span>
            </h2>
          </div>

          <AutoAnimate className="flex flex-col gap-4">
            <Card className="animate-fade-in-down relative flex flex-col gap-4 p-4">
              <div className="break-words">Men&apos;s hammer throw 14.00</div>
              <div className="break-words">Women&apos;s hammer throw 16.00</div>
              <div className="flex items-center justify-between text-gray-300">
                <button onClick={() => setBut(!but)}>
                  <span className="flex items-center gap-1.5 text-sm">
                    {!but ? (
                      <HiOutlineEye className="text-xl" />
                    ) : (
                      <HiOutlineEyeOff className="text-xl" />
                    )}
                    Show athlete
                  </span>
                </button>
                <button className="relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white">
                  <HiOutlineTrash className="text-xl" />
                  <span>Edit</span>
                </button>
              </div>
            </Card>
            <Card className="animate-fade-in-down relative flex flex-col gap-4 p-4">
              <Button
                onClick={() => setBut(!but)}
                // disabled={but === true}
                // loading={but === true}
                size="lg"
                variant="primary"
              >
                Submit
              </Button>
              <Button
                onClick={() => setBut(!but)}
                // disabled={but === true}
                // loading={but === true}
                size="lg"
                variant="secondary"
              >
                Submit
              </Button>
              <Button
                onClick={() => setBut(!but)}
                // disabled={but === true}
                // loading={but === true}
                size="lg"
                variant="ghost"
              >
                Submit
              </Button>
              <Button
                onClick={() => setBut(!but)}
                // disabled={but === true}
                // loading={but === true}
                size="lg"
                variant="danger"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setBut(!but)}
                // disabled={but === true}
                // loading={but === true}
                size="lg"
                variant="text"
              >
                <div className="flex items-center gap-2">
                  <HiOutlinePlus />
                  Add
                </div>
              </Button>
            </Card>
            <Card className="animate-fade-in-down relative flex flex-col gap-4 p-4">
              <Button
                onClick={() => setBut(!but)}
                // disabled={but === true}
                // loading={but === true}
                size="lg"
                variant="primary-inverted"
              >
                Submit
              </Button>
              <Button
                onClick={() => setBut(!but)}
                // disabled={but === true}
                // loading={but === true}
                size="lg"
                variant="secondary-inverted"
              >
                Submit
              </Button>
              <TextInput
                placeholder="Type something..."
                className="w-full"
                type="text"
                prefixEl="dude"
                suffixEl="dude"
                maxLength={400}
              />
            </Card>
          </AutoAnimate>
        </div>
        {/* Preview window */}
        <div className="col-span-4 flex py-4 pl-3 pr-3">
          <Card className="flex flex-1 flex-col divide-y divide-neutral-900">
            <AutoAnimate className="flex flex-1 items-center justify-center p-4 text-lg font-medium">
              {/* <span></span> */}
              <div className="max-w-xs">
                <div className="w-full max-w-xs border-t-2 border-cyan-300 bg-black/90">
                  <h1 className="px-2 uppercase text-cyan-300">Final</h1>
                  <div className="flex">
                    <h3 className="bg-cyan-300 px-2 uppercase text-black">
                      Men&#39;s hammer throw
                    </h3>
                    <h4 className="px-2 uppercase">Distance</h4>
                  </div>
                  <ul className="">
                    <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
                      1 Sauli Niinisto
                      <span>80.50m</span>
                    </li>
                    <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
                      2 Stuart Little
                      <span>80.10m</span>
                    </li>
                    <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
                      3 Logan Paul
                      <span>79.10m</span>
                    </li>
                    <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
                      4 Warren Buffet
                      <span>79.06m</span>
                    </li>
                    <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
                      5 Rudy Wrinkler
                      <span>75.69m</span>
                    </li>
                    <li className=" flex flex-wrap justify-between border-t-2 border-black/50">
                      <div
                        className={clsx(
                          "flex flex-[1_1_100%] justify-between px-4 py-1",
                          show ? "bg-cyan-300 text-black" : ""
                        )}
                      >
                        6 Aaron Kangas
                        <span className={show ? "hidden" : "block"}>
                          75.10m
                        </span>
                      </div>
                      <ul
                        className={clsx(
                          "ml-1 flex-[1_1_100%] bg-gray-300 text-black",
                          show ? "flex" : "hidden"
                        )}
                      >
                        <li className="px-1 py-3">69.50</li>
                        <li className="bg-gray-200 px-1 py-3">69.55</li>
                        <li className="bg-cyan-300/50 px-1 py-3">75.10</li>
                        <li className="px-1 py-3">55.55</li>
                        <li className="bg-gray-200 px-1 py-3">70.69</li>
                        <li className="px-1 py-3">67.59</li>
                      </ul>
                    </li>
                    <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
                      7 Pavel Fajdek
                      <span>70.10m</span>
                    </li>
                    <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
                      8 Kokhan
                      <span>70.09m</span>
                    </li>
                    <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
                      9 Sean Donnelly
                      <span>70.08m</span>
                    </li>
                    <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
                      10 Bob Ross
                      <span>70.05m</span>
                    </li>
                  </ul>
                </div>
                <h1 className="mt-1 inline-flex bg-black/90 p-1 uppercase text-cyan-300">
                  Tour De Hammer 2023
                </h1>
              </div>
            </AutoAnimate>
            <div className="grid grid-cols-3 divide-x divide-neutral-900">
              <button
                className="flex items-center justify-center gap-2 rounded-bl p-4 hover:bg-neutral-700"
                // onClick={() => unpinQuestion()}
              >
                <HiOutlineEyeOff />
                Hide
              </button>
              <button
                className="flex items-center justify-center gap-2 rounded-bl p-4 hover:bg-neutral-700"
                // onClick={() => unpinQuestion()}
              >
                {/* <FaEyeSlash /> */}
                All Results
              </button>

              <button
                className="flex items-center justify-center gap-2 rounded-br p-4 hover:bg-neutral-700"
                onClick={() => setShow(!show)}
              >
                {/* <FaCaretSquareRight /> */}
                Next Athlete
              </button>
            </div>
          </Card>
        </div>
        {/* Athletes column */}
        <div className="col-span-2 flex flex-col gap-4 overflow-y-auto py-4 pl-3 pr-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-medium">
              <span>Athletes</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold">
                {data?.length}
              </span>
            </h2>
            <div className="flex items-center">
              <button
                className="relative z-10 -my-2 flex items-center gap-1.5 rounded py-2 px-2 text-sm hover:bg-neutral-900/50 hover:text-white"
                onClick={() => data.sort((a, b) => (a < b ? 1 : -1))}
              >
                <HiReply />
              </button>
              <button
                className="relative z-10 -my-2 flex items-center gap-1.5 rounded py-2 px-2 text-sm hover:bg-neutral-900/50 hover:text-white"
                onClick={() => Sorted()}
              >
                {reverseSort ? (
                  <HiSortDescending className="text-xl" />
                ) : (
                  <HiSortAscending className="text-xl" />
                )}
              </button>
            </div>
          </div>
          <AutoAnimate
            className={clsx(
              "flex flex-col gap-4"
              // reverseSort ? "flex-col-reverse" : "flex-col"
            )}
          >
            {data?.map((ath) => (
              <Card
                key={ath.id}
                className="animate-fade-in-down relative flex flex-col gap-4 p-4"
              >
                <div
                  key={ath.id}
                  className="flex items-center gap-3 break-words"
                >
                  <p className="">{ath.name}</p>
                  <span className="text-xs opacity-70">
                    PB: {ath.PB} SB: {ath.SB}
                  </span>
                </div>

                <div className="flex gap-2">
                  {ath.attempts.map((at) => (
                    <p
                      key={at.id}
                      className="-my-1 rounded bg-neutral-900/50 px-2 py-1 text-sm"
                    >
                      {at.attempt1}
                    </p>
                  ))}
                  {ath.attempts.length < 6 && (
                    <button
                      className="relative -my-1 flex items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-neutral-900/50 hover:text-white"
                      onClick={() => toggle(ath.id)}
                    >
                      <HiOutlinePlus className="text-base" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <button
                    onClick={() => setBut(!but)}
                    className="relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white"
                  >
                    {!but ? (
                      <HiOutlineEye className="text-xl" />
                    ) : (
                      <HiOutlineEyeOff className="text-xl" />
                    )}
                    <span>Show athlete</span>
                  </button>

                  <button
                    className="relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white"
                    onClick={() => deleted.mutate({ id: ath.id })}
                  >
                    <HiOutlineTrash className="text-xl" />
                    <span>Remove</span>
                  </button>
                </div>
              </Card>
            ))}
            {data.length === 0 && (
              <Link
                href="/create"
                className="flex items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-neutral-900/50 hover:text-white"
              >
                <HiOutlinePlus className="text-base" />
                <span>Add an athlete</span>
              </Link>
            )}
            {data.length > 0 && (
              <Button
                onClick={() => clearAll.mutate()}
                disabled={clearAll.isLoading}
                loading={clearAll.isLoading}
                size="lg"
                variant="secondary"
              >
                Clear all
              </Button>
            )}
          </AutoAnimate>
        </div>
      </div>
      <portals.InPortal node={portalNode!}>
        <AddAttempt setModal={setModal} athleteId={id} />
      </portals.InPortal>
      {modal && <portals.OutPortal node={portalNode!} />}
    </Layout>
  );
}

/* add better typing then just any L man for that
 fix this real quick */
function AddAttempt({
  setModal,
  athleteId,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  athleteId?: string;
}) {
  const { refetch } = trpc.athletes.getAll.useQuery();
  const { mutate, isLoading } = trpc.athletes.addAttempt.useMutation({
    onSuccess: (data) => {
      console.log("submitted", data);
      setModal(false);
      refetch();
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddAttemptInputType>({
    resolver: zodResolver(addAttemptInput),
  });

  return (
    <div
      className="absolute top-0 right-0 left-0 bottom-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50"
      // onClick={() => setModal(false)}
    >
      <div className="relative rounded bg-neutral-800 p-5">
        <button
          className="absolute top-5 right-5"
          onClick={() => setModal(false)}
        >
          L + Ratio
        </button>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit((data) => {
            console.log("submit", data);
            mutate({
              athleteId,
              attempt1: data.attempt1,
            });
          })}
        >
          <div className="flex flex-col gap-2">
            <label className="font-normal">Add attempt</label>
            <input
              className="mt-1 rounded bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
              type="text"
              {...register("attempt1")}
              placeholder="60.69"
            />
            {errors.attempt1 && (
              <p className="py-2 text-xs text-red-400">
                {errors.attempt1.message}
              </p>
            )}
          </div>
          {/* <p>{id}</p> */}
          {/* <div className="flex flex-col gap-2">

              <label className="font-normal">Athlete ID</label>
              <input
                // disabled
                className="mt-1 rounded bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 disabled:opacity-50 sm:text-sm"
                type="text"
                {...register("athleteId")}
                defaultValue={athleteID}
              />
            </div> */}
          {/* <button
              type="submit"
              className="rounded bg-neutral-500 py-2 px-4 text-sm font-medium hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
            >
              Add
            </button> */}
          <Button
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            size="lg"
            variant="primary"
          >
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}
