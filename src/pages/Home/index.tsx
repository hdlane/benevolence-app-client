import React from "react";
import planningCenterLogo from "@/assets/planning-center-logo.png";
import computer from "@/assets/computer.png";
import syncButton from "@/assets/sync-button.png";
import login from "@/assets/login.png";
import people from "@/assets/people.png";
import graph from "@/assets/graph.png";
import organizations from "@/assets/organizations.png";
import request from "@/assets/new-request.png";

function Home() {
    return <>
        <div className="flex flex-col h-full bg-white">
            <div className="homepage-content space-y-6">
                <section>
                    <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                            <div className="order-2 md:order-1">
                                <h2 className="text-3xl pb-5 font-semibold">A Tool for Managing Donations, Meals, and Services</h2>
                                <p>The <strong>Benevolence App</strong> helps your organization provide meals, services, and item donations to those in need. So you can focus more on what matters most— helping people.</p>
                                <ul className="list-disc pl-5 pt-4">
                                    <li><p><strong>Seamless Integration with Planning Center:</strong> Sync users, admins, and data with Planning Center People.</p></li>
                                    <li><p><strong>Intuitive Request Management:</strong> Easily create, track, and fulfill requests for donations, meals, and services.</p></li>
                                    <li><p><strong>Get Notified:</strong> Admins and users get notifications, keeping everyone on the same page.</p></li>
                                </ul>
                                <div className="text-center">
                                    <a href="/signup" style={{ textDecoration: "none", color: "#ffffff" }} className="button-primary my-6 inline-block">Sign up</a>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 flex items-center justify-center">
                                <img loading="lazy" alt="Computer showing graphs" src={computer} className="w-full max-w-[400px] md:max-w-full" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-[#84A296]">
                    <div className="max-w-screen-lg mx-auto">
                        <h3 className="text-center text-3xl font-semibold mb-4">Key Features</h3>
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                            <div>
                                <h4 className="text-xl font-semibold">User Management</h4>
                                <p>Sync all your users from Planning Center and grant them access to the Benevolence App.</p>
                                <img loading="lazy" alt="Benevolence App" src={people} className="max-w-[100px] mx-auto py-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold">Analytics for Admins</h4>
                                <p>Track the status of your requests, view unfulfilled slots, and monitor overall progress.</p>
                                <img loading="lazy" alt="Benevolence App" src={graph} className="max-w-[100px] mx-auto py-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold">Request Creation</h4>
                                <p>Admins can create donation, meal, and service requests and specify recipients and coordinators.</p>
                                <img loading="lazy" alt="Benevolence App" src={request} className="max-w-[100px] mx-auto py-6" />
                            </div>
                            <div className="">
                                <h4 className="text-xl font-semibold">Multi-Organization Support</h4>
                                <p>If you're involved with multiple organizations, choose which one to sign in to with ease.</p>
                                <img loading="lazy" alt="Benevolence App" src={organizations} className="max-w-[100px] mx-auto py-6" />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="max-w-screen-lg mx-auto">
                        <h3 className="text-3xl font-semibold mb-4">How It Works</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li><p><strong>Authorize Benevolence App:</strong> Easily connect Benevolence App to your Planning Center account. As an admin, simply log in to authorize your organization.</p></li>
                            <li><p><strong>Create &amp; Manage Requests:</strong> Whether it's food, clothing, or yard work, admins can create specific requests that people can sign up to fulfill.</p></li>
                            <li><p><strong>Track Progress:</strong> Admins get a clear overview of all requests and can track the status of each item, meal, or service.</p></li>
                            <li><p><strong>Seamless Communication:</strong> Users receive automatic notifications when they’re assigned to a request or when the request is updated.</p></li>
                        </ol>
                    </div>
                </section>

                <section className="text-white bg-[#396056]">
                    <div className="max-w-screen-lg mx-auto">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                            <div className="max-w-screen-lg mx-auto">
                                <h3 className="text-3xl font-semibold mb-4">Users:</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><p><strong>Sign Up for Requests:</strong> Browse requests and sign up to provide items, meals, or services.</p></li>
                                    <li><p><strong>Get Notified:</strong> Receive email updates when you’re assigned to a request or when the request is updated.</p></li>
                                    <li><p><strong>Cancel or Modify:</strong> Need to cancel? It's easy to unassign yourself with a few clicks.</p></li>
                                </ul>
                            </div>
                            <div className="max-w-screen-lg mx-auto">
                                <h3 className="text-3xl font-semibold mb-4">Admins:</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><p><strong>Create &amp; Customize Requests:</strong> Set up donation, meal, and service requests tailored to your organization’s needs.</p></li>
                                    <li><p><strong>Manage Slots &amp; Assignments:</strong> Control the slots for each request and see who’s signed up to fulfill them.</p></li>
                                    <li><p><strong>Sync with Planning Center:</strong> Keep all your data up to date by syncing with Planning Center People.</p></li>
                                    <li><p><strong>Monitor Analytics:</strong> Track the total number of requests, people involved, and unfulfilled slots to keep your programs running smoothly.</p></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="max-w-screen-lg mx-auto">
                        <h3 className="text-3xl text-center font-semibold mb-4">Get Started Today</h3>
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                            <div>
                                <img loading="lazy" alt="Planning Center Logo" src={planningCenterLogo} className="max-w-[250px] py-6 mx-auto" />
                                <h4 className="text-xl font-semibold">Sign Up for Planning Center</h4>
                                <p>Don’t have a Planning Center account yet? No worries, sign up for free <a href="https://www.planningcenter.com/" className="text-[#396056] hover:text-[#84A296] underline">here</a>.</p>
                            </div>
                            <div>
                                <img loading="lazy" alt="Login Field Screenshot" src={login} className="max-w-[250px] py-6 mx-auto" />
                                <h4 className="text-xl font-semibold">Log In to Benevolence App:</h4>
                                <p>After creating your account, log in to Benevolence App and start managing requests right away.</p>
                            </div>
                            <div>
                                <img loading="lazy" alt="Sync button" src={syncButton} className="max-w-[150px] py-6 mx-auto" />
                                <h4 className="text-xl font-semibold">Sync &amp; Manage:</h4>
                                <p>Sync your organization’s data from Planning Center and start creating requests!</p>
                            </div>
                        </div>
                        <div className="mx-auto text-center pt-8">
                            <h3 className="text-xl font-semibold mb-4">Ready to Help? Start Now!</h3>
                            <a href="/signup" style={{ textDecoration: "none", color: "#ffffff" }} className="button-primary">Sign up</a>
                        </div>
                    </div>
                </section>

                <section className="bg-[#84A296]">
                    <div className="max-w-screen-lg mx-auto">
                        <h3 className="text-3xl font-semibold mb-4">Frequently Asked Questions</h3>
                        <h4 className="text-xl font-semibold">How do I sign up or cancel my participation in a request?</h4>
                        <p>Go to your Dashboard, select a request, and sign up for the available slots. To cancel, simply unassign yourself.</p>
                        <h4 className="text-xl font-semibold mt-4">How do I view the details of a request?</h4>
                        <p>Admins can view the details of all requests, while users can check the request description to see who’s already signed up and what’s needed.</p>
                        <h4 className="text-xl font-semibold mt-4">How can I track my organization’s progress?</h4>
                        <p>Admins can view key metrics like total synced users, the number of requests, and the fulfillment status from the Admin page.</p>
                    </div>
                </section>

                <section className="pb-20">
                    <div className="max-w-screen-lg mx-auto text-center">
                        <h3 className="text-3xl font-semibold mb-4">Use Benevolence App to Make a Difference</h3>
                        <p>Let Benevolence App help you organize and manage your outreach programs with ease and efficiency!</p>
                    </div>
                </section>
            </div>
        </div>
    </>
}

export default Home;
