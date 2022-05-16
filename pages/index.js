import Head from 'next/head'
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import Feed from '../components/Feed';
import Modal from '../components/Modal';
import { Widget } from '../components/Widget';


import { useRecoilState } from "recoil";
import { modalState, modalTypeState } from "../atoms/modalAtom";

import { AnimatePresence } from "framer-motion";

import { connectToDatabase } from "../utils/mongodb";


export default function Home({ posts, articles }) {

  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  const router = useRouter();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/landin");
    },
  });

  return (
    <div className="bg-[#F3F2EF] dark:bg-black dark:text-white h-screen overflow-y-scroll md:space-y-6">
      <Head>
        <title>Feed | LinkedIn</title>
        <link rel="icon" href="/favi.png" />
      </Head>

      <Header />

      <main className="flex justify-center gap-x-5 px-4 sm:px-12">
        <div className="flex flex-col md:flex-row gap-5">
          <Sidebar />
          <Feed posts={posts} />
        </div>

        <Widget articles={articles} />
        <AnimatePresence>
          {modalOpen && (
            <Modal handleClose={() => setModalOpen(false)} type={modalType} />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if(!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/landin",
      }
    }
  }

   // Get posts on SSR
   const { db } = await connectToDatabase();
   const posts = await db
     .collection("posts")
     .find()
     .sort({ timestamp: -1 })
     .toArray();
 
   // Get Google News API
   const results = await fetch(
     `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
   ).then((res) => res.json());

  return {
    props: {
      session,
      posts: posts.map(post => ({
        _id: post._id.toString(),
        input: post.input,
        photoUrl: post.photoUrl,
        username: post.username,
        email: post.email,
        userImg: post.userImg,
        createdAt: post.createdAt,
      })),
      articles: results.articles,
    }
  }
}
