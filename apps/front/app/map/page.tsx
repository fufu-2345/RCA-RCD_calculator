"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

function Page() {
  return (
    <div>
      <nav>
        <Link href="../">Back</Link>&nbsp;|&nbsp;
        <Link href="/rawdata">Rawdata</Link>
      </nav>
    </div>
  );
}

export default Page;
